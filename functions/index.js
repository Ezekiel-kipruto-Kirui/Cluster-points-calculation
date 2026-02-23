const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
const express = require("express");
const path = require("path");
const crypto = require("crypto");

const region = String(process.env.FUNCTIONS_REGION || "us-central1").trim() || "us-central1";

const getEnv = (key, fallback = "") => String(process.env[key] || fallback).trim();
const localLogLevel = getEnv("LOCAL_LOG_LEVEL", "info").toLowerCase();
const keepAliveOnFatal = getEnv("LOCAL_KEEP_ALIVE_ON_FATAL", "true").toLowerCase() === "true";

const safeErrorObject = (error) => ({
  name: error?.name || "Error",
  message: error?.message || "Unknown error.",
  code: error?.code || "",
  stack: error?.stack || "",
});

const logLocal = (level, message, payload = {}) => {
  const levelOrder = { debug: 10, info: 20, warn: 30, error: 40 };
  const minLevel = levelOrder[localLogLevel] || levelOrder.info;
  const currentLevel = levelOrder[level] || levelOrder.info;
  if (currentLevel < minLevel) return;

  if (level === "debug") logger.debug(message, payload);
  else if (level === "warn") logger.warn(message, payload);
  else if (level === "error") logger.error(message, payload);
  else logger.info(message, payload);
};

const truncate = (value, maxLength = 160) => {
  const text = String(value || "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const summarizeBody = (body) => {
  if (!body || typeof body !== "object") return {};
  return {
    keys: Object.keys(body),
    amount: body.amount,
    phone:
      body["phone number"] || body.phone || body.phone_number || body.phoneNumber || "",
    email: body.email || "",
  };
};

const getRequestPath = (request) => request.originalUrl || request.url || request.path || "";

const ensureRequestId = (request) => {
  if (request.requestId) return String(request.requestId);
  const headerRequestId =
    request.headers?.["x-request-id"] || request.headers?.["x-correlation-id"] || "";
  const requestId = headerRequestId ? String(headerRequestId) : crypto.randomUUID();
  request.requestId = requestId;
  return requestId;
};

const logHandlerAccess = (handlerName, request) => {
  const requestId = ensureRequestId(request);
  logLocal("info", "Handler accessed", {
    requestId,
    handler: handlerName,
    method: request.method,
    path: getRequestPath(request),
    body: summarizeBody(getBody(request)),
  });
};

const withAsyncGuard = (handlerName, handler) => async (request, response, next) => {
  try {
    await handler(request, response, next);
  } catch (error) {
    logger.error("Unhandled route runtime error", {
      requestId: ensureRequestId(request),
      handler: handlerName,
      method: request.method,
      path: getRequestPath(request),
      body: summarizeBody(getBody(request)),
      ...safeErrorObject(error),
    });

    if (typeof next === "function") {
      next(error);
      return;
    }

    if (!response.headersSent) {
      response.status(500).json({
        error: "Internal server error.",
        requestId: ensureRequestId(request),
      });
    }
  }
};

const requireEnv = (key) => {
  const value = getEnv(key);
  if (!value) {
    const error = new Error(`${key} is not configured.`);
    error.statusCode = 500;
    throw error;
  }
  return value;
};

const getBody = (request) => (request.body && typeof request.body === "object" ? request.body : {});

const assertMethod = (request, response, method = "POST") => {
  if (request.method === method) return true;
  response.status(405).json({ error: `Method ${request.method} is not allowed. Use ${method}.` });
  return false;
};

const phoneDigitsOnly = (value) => String(value || "").replace(/\D/g, "");

const normalizeKenyanPhone = (value) => {
  const digits = phoneDigitsOnly(value);
  if (!digits) throw new Error("Phone number is required.");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  throw new Error("Use a valid Kenyan phone number, e.g. 0712345678 or 254712345678.");
};

const normalizeAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a number greater than 0.");
  }
  return Math.round(amount);
};

const formatDarajaTimestamp = () => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter
    .formatToParts(new Date())
    .filter((part) => part.type !== "literal")
    .reduce((accumulator, part) => {
      accumulator[part.type] = part.value;
      return accumulator;
    }, {});

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
};

const getDarajaBaseUrl = () => {
  const environment = getEnv("MPESA_ENVIRONMENT", "sandbox").toLowerCase();
  return environment === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
};

const isCloudRuntime = () => Boolean(process.env.K_SERVICE || process.env.FUNCTION_TARGET);

const getFirebaseCallbackUrl = () => {
  const projectId = getEnv("GCLOUD_PROJECT") || getEnv("GOOGLE_CLOUD_PROJECT");
  if (!projectId) return "";
  return `https://${region}-${projectId}.cloudfunctions.net/callback`;
};

const getDarajaCallbackUrl = () => {
  const localCallback = getEnv("MPESA_CALLBACK_URL_LOCAL");
  const firebaseCallback = getEnv("MPESA_CALLBACK_URL_FIREBASE");
  const genericCallback = getEnv("MPESA_CALLBACK_URL");

  if (isCloudRuntime()) {
    return firebaseCallback || genericCallback || getFirebaseCallbackUrl();
  }

  return localCallback || genericCallback || getFirebaseCallbackUrl();
};

const getDarajaToken = async () => {
  const consumerKey = requireEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = requireEnv("MPESA_CONSUMER_SECRET");
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const tokenEndpoint = `${getDarajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;

  const response = await fetch(tokenEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.errorMessage || payload.error || `Daraja auth failed with HTTP ${response.status}.`);
    error.statusCode = response.status;
    throw error;
  }

  if (!payload.access_token) {
    throw new Error("Daraja auth response did not include access_token.");
  }

  return payload.access_token;
};

const getDarajaTransactionType = () => {
  const shortcodeType = getEnv("MPESA_SHORTCODE_TYPE", "till_number")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (shortcodeType === "paybill" || shortcodeType === "customerpaybillonline") {
    return "CustomerPayBillOnline";
  }

  if (
    shortcodeType === "tillnumber" ||
    shortcodeType === "buygoods" ||
    shortcodeType === "customerbuygoodsonline"
  ) {
    return "CustomerBuyGoodsOnline";
  }

  const error = new Error(
    "Invalid MPESA_SHORTCODE_TYPE. Use paybill, till_number, CustomerPayBillOnline, or CustomerBuyGoodsOnline.",
  );
  error.statusCode = 500;
  throw error;
};

const requestStkPush = async ({ phone, amount, accountReference, transactionDesc }) => {
  const callbackUrl = getDarajaCallbackUrl();
  if (!callbackUrl) {
    const error = new Error(
      "MPESA_CALLBACK_URL is not configured. Set MPESA_CALLBACK_URL_LOCAL and/or MPESA_CALLBACK_URL_FIREBASE.",
    );
    error.statusCode = 500;
    throw error;
  }
  const businessShortCode = getEnv("MPESA_EXPRESS_SHORTCODE") || requireEnv("MPESA_SHORTCODE");
  const passkey = requireEnv("MPESA_PASSKEY");

  const normalizedPhone = normalizeKenyanPhone(phone);
  const normalizedAmount = normalizeAmount(amount);
  const timestamp = formatDarajaTimestamp();
  const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString("base64");
  const accessToken = await getDarajaToken();

  const stkPayload = {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: getDarajaTransactionType(),
    Amount: normalizedAmount,
    PartyA: normalizedPhone,
    PartyB: businessShortCode,
    PhoneNumber: normalizedPhone,
    CallBackURL: callbackUrl,
    AccountReference: String(accountReference || "KUCCPS-CLUSTER").slice(0, 12),
    TransactionDesc: String(transactionDesc || "Cluster payment").slice(0, 13),
  };

  const endpoint = `${getDarajaBaseUrl()}/mpesa/stkpush/v1/processrequest`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stkPayload),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.errorMessage || payload.errorCode || `Daraja STK request failed with HTTP ${response.status}.`);
    error.statusCode = response.status;
    throw error;
  }

  return payload;
};

let emailTransport = null;

const getEmailTransport = () => {
  if (emailTransport) return emailTransport;

  const user = requireEnv("EMAIL_HOST_USER");
  const pass = requireEnv("EMAIL_HOST_PASSWORD");
  const host = getEnv("EMAIL_HOST", "smtp.gmail.com");
  const port = Number(getEnv("EMAIL_HOST_PORT", "465"));
  const secure = getEnv("EMAIL_HOST_SECURE", port === 465 ? "true" : "false").toLowerCase() === "true";

  emailTransport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return emailTransport;
};

const sanitizeHeaderValue = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();

const loadLocalEnvFile = () => {
  if (require.main !== module) return;
  if (typeof process.loadEnvFile !== "function") return;
  if (process.env.K_SERVICE || process.env.FUNCTION_TARGET) return;

  const envPath = path.join(__dirname, ".env");
  try {
    process.loadEnvFile(envPath);
  } catch (error) {
    logger.debug("Local .env was not loaded", {
      message: error?.message || "Unknown .env load error.",
    });
  }
};

loadLocalEnvFile();

let hasInstalledProcessHandlers = false;

const installProcessErrorHandlers = () => {
  if (hasInstalledProcessHandlers) return;
  hasInstalledProcessHandlers = true;

  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason || "Unhandled rejection."));
    logger.error("Unhandled promise rejection", safeErrorObject(error));
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", safeErrorObject(error));
    if (isCloudRuntime() || !keepAliveOnFatal) {
      process.exitCode = 1;
      process.exit(1);
    }
  });

  process.on("uncaughtExceptionMonitor", (error) => {
    logger.error("Uncaught exception monitor", safeErrorObject(error));
  });
};

installProcessErrorHandlers();

const stkPushHandler = async (request, response) => {
  logHandlerAccess("stkPush", request);

  if (request.method === "GET") {
    response.status(200).json({
      status: "ready",
      route: "/stkPush",
      method: "POST",
      requiredBody: ["phone number|phone_number|phoneNumber|phone", "amount"],
      callbacks: {
        active: getDarajaCallbackUrl() || "",
        local: getEnv("MPESA_CALLBACK_URL_LOCAL"),
        firebase: getEnv("MPESA_CALLBACK_URL_FIREBASE"),
      },
      note: "Submit JSON in POST body to initiate STK push.",
    });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;

  try {
    const body = getBody(request);
    const phone =
      body["phone number"] || body.phone_number || body.phoneNumber || body.phone || "";
    const amount = body.amount;
    const accountReference = body.accountReference;
    const transactionDesc = body.transactionDesc;

    const result = await requestStkPush({ phone, amount, accountReference, transactionDesc });
    logLocal("info", "STK push request queued", {
      requestId: request.requestId || "",
      phone: truncate(phone, 32),
      amount,
      checkoutRequestId: result?.CheckoutRequestID || "",
      merchantRequestId: result?.MerchantRequestID || "",
    });
    response.status(200).json({
      status: "queued",
      ...result,
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode || 500);
    logger.error("stkPush failed", {
      message: error?.message || "Unknown STK push error.",
      statusCode,
    });
    response.status(statusCode).json({
      error: error?.message || "Daraja STK push request failed.",
    });
  }
};

const darajaCallbackHandler = async (request, response) => {
  logHandlerAccess("darajaCallback", request);

  if (request.method !== "POST") {
    response.status(200).json({ status: "ok" });
    return;
  }

  logger.info("Daraja callback received", {
    body: request.body || null,
  });

  response.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
};

const sendEmailHandler = async (request, response) => {
  logHandlerAccess("sendEmail", request);

  if (request.method === "GET") {
    response.status(200).json({
      status: "ready",
      route: "/sendEmail",
      method: "POST",
      requiredBody: ["email", "subject", "message"],
      note: "Submit JSON in POST body to send email.",
    });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;

  try {
    const body = getBody(request);
    const to = sanitizeHeaderValue(body.email);
    const subject = sanitizeHeaderValue(body.subject);
    const message = String(body.message || "");

    if (!to || !subject || !message) {
      response.status(400).json({ error: "email, subject, and message are required." });
      return;
    }

    const hostUser = requireEnv("EMAIL_HOST_USER");
    const from = sanitizeHeaderValue(getEnv("EMAIL_FROM", hostUser));
    const transport = getEmailTransport();
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text: message,
    });

    response.status(200).json({
      status: "sent",
      messageId: info.messageId,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode || 500);
    logger.error("sendEmail failed", {
      message: error?.message || "Unknown email error.",
      statusCode,
    });
    response.status(statusCode).json({
      error: error?.message || "Email delivery failed.",
    });
  }
};

const createLocalApp = () => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use((request, response, next) => {
    request.requestId = ensureRequestId(request);
    const startedAt = Date.now();

    logLocal("info", "Incoming request", {
      requestId: request.requestId,
      method: request.method,
      path: getRequestPath(request),
      ip: request.ip || request.socket?.remoteAddress || "",
      userAgent: truncate(request.headers["user-agent"] || "", 180),
      contentType: request.headers["content-type"] || "",
    });

    response.on("finish", () => {
      logLocal("info", "Request completed", {
        requestId: request.requestId,
        method: request.method,
        path: getRequestPath(request),
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  });

  app.use((request, response, next) => {
    response.set("Access-Control-Allow-Origin", getEnv("LOCAL_CORS_ORIGIN", "*") || "*");
    response.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    next();
  });

  app.get("/health", (request, response) => {
    response.status(200).json({
      status: "ok",
      service: "kuccps-cluster-functions",
    });
  });

  app.all("/stkPush", withAsyncGuard("stkPush", stkPushHandler));
  app.all("/callback", withAsyncGuard("callback", darajaCallbackHandler));
  app.all("/darajaCallback", withAsyncGuard("darajaCallback", darajaCallbackHandler));
  app.all("/sendEmail", withAsyncGuard("sendEmail", sendEmailHandler));

  app.use((error, request, response, next) => {
    logger.error("Unhandled express error", {
      requestId: request.requestId || "",
      method: request.method,
      path: request.originalUrl || request.url,
      body: summarizeBody(getBody(request)),
      ...safeErrorObject(error),
    });

    if (response.headersSent) {
      next(error);
      return;
    }

    const statusCode =
      Number(error?.statusCode || error?.status || 500) >= 400
        ? Number(error?.statusCode || error?.status || 500)
        : 500;

    response.status(statusCode).json({
      error: error?.message || "Internal server error.",
      requestId: request.requestId || "",
    });
  });

  app.use((request, response) => {
    response.status(404).json({ error: "Not found." });
  });

  return app;
};

const startLocalServer = async ({ app, requestedPort, retries }) =>
  new Promise((resolve, reject) => {
    const tryListen = (port, remainingRetries) => {
      const server = app.listen(port, () => {
        resolve({ server, port });
      });

      server.once("error", (error) => {
        if (error?.code === "EADDRINUSE" && remainingRetries > 0) {
          logger.warn("Local port is in use, trying next port.", {
            attemptedPort: port,
            nextPort: port + 1,
          });
          tryListen(port + 1, remainingRetries - 1);
          return;
        }

        reject(error);
      });
    };

    tryListen(requestedPort, retries);
  });

exports.stkPush = onRequest({ region, cors: true }, withAsyncGuard("stkPush", stkPushHandler));
exports.callback = onRequest({ region, cors: true }, withAsyncGuard("callback", darajaCallbackHandler));
exports.darajaCallback = onRequest({ region, cors: true }, withAsyncGuard("darajaCallback", darajaCallbackHandler));
exports.sendEmail = onRequest({ region, cors: true }, withAsyncGuard("sendEmail", sendEmailHandler));

if (require.main === module) {
  const port = Number(getEnv("PORT", "5001")) || 5001;
  const retries = Number(getEnv("PORT_RETRIES", "20")) || 20;
  const app = createLocalApp();

  startLocalServer({ app, requestedPort: port, retries })
    .then(({ port: actualPort }) => {
      logger.info("Functions local server started", {
        url: `http://localhost:${actualPort}`,
        requestedPort: port,
        endpoints: ["/stkPush", "/callback", "/darajaCallback", "/sendEmail", "/health"],
        callbackLocal: getEnv("MPESA_CALLBACK_URL_LOCAL") || "",
        callbackFirebase: getEnv("MPESA_CALLBACK_URL_FIREBASE") || "",
      });
    })
    .catch((error) => {
      logger.error("Failed to start local functions server", {
        message: error?.message || "Unknown startup error.",
        code: error?.code || "UNKNOWN",
        requestedPort: port,
      });
      process.exitCode = 1;
    });
}
