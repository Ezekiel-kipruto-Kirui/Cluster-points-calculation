"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateClusterPointsAfterPayment = exports.waitForSuccessfulPayment = exports.fetchPaymentStatus = exports.sendServiceEmail = exports.initiateDarajaPayment = exports.fetchAdminHealth = exports.calculateLocally = void 0;
const clusterEngine_1 = require("./clusterEngine");
const endpoints = {
    darajaPayment: "/api/payments",
    darajaQuery: "/api/payments/query",
    email: "/sendEmail",
    calculateCluster: "/calculateClusterPoints",
    adminHealth: "/api/admin/health",
};
const parseResponseBody = async (response) => {
    try {
        const text = await response.text();
        if (!text)
            return null;
        return JSON.parse(text);
    }
    catch {
        return null;
    }
};
const postRequest = async ({ url, headers, body, }) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: headers || {},
        body: body || undefined,
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const getRequest = async ({ url, headers, }) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: headers || {},
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const extractErrorMessage = (result, fallback) => {
    const body = result?.data || {};
    const directMessage = body?.error || body?.message || body?.errorMessage || body?.ResultDesc;
    if (directMessage)
        return String(directMessage);
    return fallback;
};
const unwrapSuccessPayload = (resultData) => {
    if (resultData && typeof resultData === "object" && "data" in resultData && resultData.success !== false) {
        return resultData.data;
    }
    return resultData;
};
const calculateLocally = (grades) => ({
    source: "local-engine",
    results: (0, clusterEngine_1.computeAllClusters)(grades),
    medicineEligible: (0, clusterEngine_1.medicineEligibility)(grades),
});
exports.calculateLocally = calculateLocally;
const fetchAdminHealth = async () => {
    const result = await getRequest({ url: endpoints.adminHealth });
    if (result.ok)
        return unwrapSuccessPayload(result.data);
    throw new Error(extractErrorMessage(result, "Unable to reach admin API."));
};
exports.fetchAdminHealth = fetchAdminHealth;
const initiateDarajaPayment = async (payload) => {
    const phone = payload?.["phone number"] ||
        payload?.phone_number ||
        payload?.phoneNumber ||
        payload?.phone ||
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
exports.initiateDarajaPayment = initiateDarajaPayment;
const sendServiceEmail = async (payload) => {
    const email = String(payload?.email || "").trim();
    const subject = String(payload?.subject || "").trim();
    const message = String(payload?.message || "");
    if (!email || !subject || !message) {
        throw new Error("Email, subject and message are required.");
    }
    const query = new URLSearchParams({ email, subject, message }).toString();
    const attempts = [
        {
            url: endpoints.email,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, subject, message }),
        },
        {
            url: `${endpoints.email}${endpoints.email.includes("?") ? "&" : "?"}${query}`,
            headers: {},
            body: undefined,
        },
    ];
    const statuses = [];
    const errorMessages = [];
    for (const attempt of attempts) {
        const result = await postRequest(attempt);
        if (result.ok)
            return unwrapSuccessPayload(result.data);
        statuses.push(result.status);
        errorMessages.push(extractErrorMessage(result, `HTTP ${result.status}`));
    }
    const details = errorMessages.filter(Boolean).join(" | ");
    throw new Error(`Email API request failed. ${details || `Status codes: ${statuses.join(", ")}.`}`);
};
exports.sendServiceEmail = sendServiceEmail;
const fetchPaymentStatus = async ({ checkoutRequestId, }) => {
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
    if (result.ok)
        return unwrapSuccessPayload(result.data);
    throw new Error(extractErrorMessage(result, "Unable to fetch payment status."));
};
exports.fetchPaymentStatus = fetchPaymentStatus;
const sleep = (durationMs) => new Promise((resolve) => window.setTimeout(resolve, durationMs));
const waitForSuccessfulPayment = async ({ checkoutRequestId, timeoutMs = 300000, intervalMs = 3000, onStatus, }) => {
    const startedAt = Date.now();
    let lastErrorMessage = "";
    while (Date.now() - startedAt <= timeoutMs) {
        let status;
        try {
            status = await (0, exports.fetchPaymentStatus)({ checkoutRequestId });
        }
        catch (error) {
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
        if (normalizedStatus === "success" || queryResultCode === 0)
            return status;
        if (normalizedStatus === "failed") {
            throw new Error(status?.resultDesc || "Payment failed. Please try again.");
        }
        await sleep(intervalMs);
    }
    throw new Error(lastErrorMessage
        ? `Timed out while waiting for M-Pesa confirmation. Last status: ${lastErrorMessage}`
        : "Timed out while waiting for M-Pesa confirmation.");
};
exports.waitForSuccessfulPayment = waitForSuccessfulPayment;
const calculateClusterPointsAfterPayment = async ({ grades, checkoutRequestId, merchantRequestId, }) => {
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
    if (result.ok)
        return unwrapSuccessPayload(result.data);
    throw new Error(extractErrorMessage(result, "Unable to calculate cluster points after payment."));
};
exports.calculateClusterPointsAfterPayment = calculateClusterPointsAfterPayment;
