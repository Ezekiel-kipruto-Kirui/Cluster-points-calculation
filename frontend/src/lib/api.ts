import { buildApiUrl } from "./apiBase";
import { computeAllClusters, medicineEligibility } from "./clusterEngine";

const endpoints = {
  darajaPayment: buildApiUrl("/api/payments"),
  darajaQuery: buildApiUrl("/api/payments/query"),
  email: buildApiUrl("/api/sendEmail"),
  calculateCluster: buildApiUrl("/calculateClusterPoints"),
  adminHealth: buildApiUrl("/api/admin/health"),
};

type HttpResult<T = any> = {
  ok: boolean;
  status: number;
  data: T | null;
};

const parseResponseBody = async (response: Response): Promise<any | null> => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const postRequest = async ({
  url,
  headers,
  body,
}: {
  url: string;
  headers?: Record<string, string>;
  body?: string;
}): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: headers || {},
    body: body || undefined,
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const getRequest = async ({
  url,
  headers,
}: {
  url: string;
  headers?: Record<string, string>;
}): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: headers || {},
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const extractErrorMessage = (result: HttpResult, fallback: string): string => {
  const body: any = result?.data || {};
  const directMessage = body?.error || body?.message || body?.errorMessage || body?.ResultDesc;
  if (directMessage) return String(directMessage);
  return fallback;
};

const unwrapSuccessPayload = <T = any>(resultData: any): T => {
  if (resultData && typeof resultData === "object" && "data" in resultData && resultData.success !== false) {
    return resultData.data as T;
  }
  return resultData as T;
};

export const calculateLocally = (grades: Record<string, string>) => ({
  source: "local-engine",
  results: computeAllClusters(grades),
  medicineEligible: medicineEligibility(grades),
});

export const fetchAdminHealth = async () => {
  const result = await getRequest({ url: endpoints.adminHealth });
  if (result.ok) return unwrapSuccessPayload(result.data);
  throw new Error(extractErrorMessage(result, "Unable to reach admin API."));
};

export const initiateDarajaPayment = async (payload: Record<string, unknown>) => {
  const phone =
    (payload?.["phone number"] as string) ||
    (payload?.phone_number as string) ||
    (payload?.phoneNumber as string) ||
    (payload?.phone as string) ||
    "";
  const amount = Number(payload?.amount ?? 0);

  const result = await postRequest({
    url: endpoints.darajaPayment,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_number: phone,
      amount,
      account_reference: String(payload?.account_reference || payload?.accountReference || "KUCCPS-CLUSTER"),
      transaction_description: String(payload?.transaction_description || payload?.transactionDesc || "Cluster payment"),
    }),
  });

  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to initiate STK push."));
  }

  return unwrapSuccessPayload(result.data);
};

export const sendServiceEmail = async (payload: { email: string; subject: string; message: string }) => {
  const email = String(payload?.email || "").trim();
  const subject = String(payload?.subject || "").trim();
  const message = String(payload?.message || "");
  if (!email || !subject || !message) {
    throw new Error("Email, subject and message are required.");
  }

  const urlEncodedBody = new URLSearchParams({ email, subject, message }).toString();
  const attempts = [
    {
      url: endpoints.email,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message }),
    },
    {
      url: endpoints.email,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlEncodedBody,
    },
  ];

  const statuses: number[] = [];
  const errorMessages: string[] = [];
  for (const attempt of attempts) {
    const result = await postRequest(attempt);
    if (result.ok) return unwrapSuccessPayload(result.data);
    statuses.push(result.status);
    errorMessages.push(extractErrorMessage(result, `HTTP ${result.status}`));
  }

  const details = errorMessages.filter(Boolean).join(" | ");
  throw new Error(`Email API request failed. ${details || `Status codes: ${statuses.join(", ")}.`}`);
};

export const fetchPaymentStatus = async ({
  checkoutRequestId,
}: {
  checkoutRequestId?: string;
  merchantRequestId?: string;
}) => {
  const payload = {
    checkoutRequestId: String(checkoutRequestId || "").trim(),
  };
  if (!payload.checkoutRequestId) {
    throw new Error("checkoutRequestId is required.");
  }

  const result = await postRequest({
    url: endpoints.darajaQuery,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (result.ok) return unwrapSuccessPayload(result.data);
  throw new Error(extractErrorMessage(result, "Unable to fetch payment status."));
};

const sleep = (durationMs: number) => new Promise((resolve) => window.setTimeout(resolve, durationMs));

export const waitForSuccessfulPayment = async ({
  checkoutRequestId,
  timeoutMs = 300000,
  intervalMs = 3000,
  onStatus,
}: {
  checkoutRequestId?: string;
  merchantRequestId?: string;
  timeoutMs?: number;
  intervalMs?: number;
  onStatus?: (status: any) => void;
}) => {
  const startedAt = Date.now();
  let lastErrorMessage = "";

  while (Date.now() - startedAt <= timeoutMs) {
    let status: any;
    try {
      status = await fetchPaymentStatus({ checkoutRequestId });
    } catch (error: any) {
      lastErrorMessage = String(error?.message || "").trim() || lastErrorMessage;
      onStatus?.({
        status: "pending",
        transientError: true,
        resultDesc: lastErrorMessage || "Temporary payment status check issue.",
      });
      await sleep(intervalMs);
      continue;
    }

    onStatus?.(status);
    const normalizedStatus = String(status?.status || "").trim().toLowerCase();
    const queryResultCode = Number(status?.queryResponse?.ResultCode ?? NaN);

    if (normalizedStatus === "success" || queryResultCode === 0) return status;
    if (normalizedStatus === "failed") {
      throw new Error(status?.resultDesc || "Payment failed. Please try again.");
    }

    await sleep(intervalMs);
  }

  throw new Error(
    lastErrorMessage
      ? `Timed out while waiting for M-Pesa confirmation. Last status: ${lastErrorMessage}`
      : "Timed out while waiting for M-Pesa confirmation.",
  );
};

export const calculateClusterPointsAfterPayment = async ({
  grades,
  checkoutRequestId,
  merchantRequestId,
}: {
  grades: Record<string, string>;
  checkoutRequestId?: string;
  merchantRequestId?: string;
}) => {
  const payload = {
    grades: grades || {},
    checkoutRequestId: String(checkoutRequestId || "").trim(),
    merchantRequestId: String(merchantRequestId || "").trim(),
  };
  if (!payload.checkoutRequestId && !payload.merchantRequestId) {
    throw new Error("checkoutRequestId or merchantRequestId is required before calculation.");
  }

  const result = await postRequest({
    url: endpoints.calculateCluster,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (result.ok) return unwrapSuccessPayload(result.data);
  throw new Error(extractErrorMessage(result, "Unable to calculate cluster points after payment."));
};
