"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminAuth = void 0;
const react_1 = require("react");
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
const extractErrorMessage = (payload, fallback) => String(payload?.error || payload?.message || fallback).trim() || fallback;
const useAdminAuth = ({ enabled = true } = {}) => {
    const [adminUser, setAdminUser] = (0, react_1.useState)(null);
    const [adminProfile, setAdminProfile] = (0, react_1.useState)(null);
    const [authLoading, setAuthLoading] = (0, react_1.useState)(enabled);
    const [authWorking, setAuthWorking] = (0, react_1.useState)(false);
    const [authError, setAuthError] = (0, react_1.useState)("");
    const backendAuthReady = (0, react_1.useMemo)(() => true, []);
    const loadCurrentAdmin = (0, react_1.useCallback)(async () => {
        setAuthLoading(true);
        try {
            const response = await fetch("/api/admin/me", {
                method: "GET",
                credentials: "include",
            });
            const payload = await parseResponseBody(response);
            if (!response.ok) {
                setAdminUser(null);
                setAdminProfile(null);
                return;
            }
            setAdminUser(payload?.user || null);
            setAdminProfile(payload?.profile || null);
            setAuthError("");
        }
        catch {
            setAdminUser(null);
            setAdminProfile(null);
        }
        finally {
            setAuthLoading(false);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (!enabled) {
            setAuthLoading(false);
            return;
        }
        loadCurrentAdmin().catch(() => { });
    }, [enabled, loadCurrentAdmin]);
    const login = (0, react_1.useCallback)(async (email, password) => {
        setAuthWorking(true);
        setAuthError("");
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: String(email || "").trim(),
                    password: String(password || ""),
                }),
            });
            const payload = await parseResponseBody(response);
            if (!response.ok) {
                const message = extractErrorMessage(payload, "Authentication request failed.");
                setAuthError(message);
                return { success: false, error: message };
            }
            setAdminUser(payload?.user || null);
            setAdminProfile(payload?.profile || null);
            setAuthError("");
            return { success: true, user: payload?.user || undefined, profile: payload?.profile || undefined, error: "" };
        }
        catch (error) {
            const message = error?.message || "Authentication request failed.";
            setAuthError(message);
            return { success: false, error: message };
        }
        finally {
            setAuthWorking(false);
        }
    }, []);
    const loginWithGoogle = (0, react_1.useCallback)(async () => {
        const message = "Google popup login is disabled in backend-auth mode. Use email and password.";
        setAuthError(message);
        return { success: false, error: message };
    }, []);
    const logout = (0, react_1.useCallback)(async () => {
        setAuthWorking(true);
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "include",
            });
        }
        finally {
            setAdminUser(null);
            setAdminProfile(null);
            setAuthError("");
            setAuthWorking(false);
        }
    }, []);
    const addRegularAdmin = (0, react_1.useCallback)(async ({ email, password, name }) => {
        if (!adminUser || !adminProfile) {
            throw new Error("You must be logged in as admin.");
        }
        if (adminProfile.role !== "super") {
            throw new Error("Only a super admin can add regular admin users.");
        }
        const response = await fetch("/api/admin/regular-admin", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: String(email || "").trim(),
                password: String(password || ""),
                name: String(name || "").trim(),
            }),
        });
        const payload = await parseResponseBody(response);
        if (!response.ok) {
            throw new Error(extractErrorMessage(payload, "Unable to create regular admin."));
        }
        return {
            user: payload?.user || null,
            profile: payload?.profile || null,
        };
    }, [adminProfile, adminUser]);
    return {
        firebaseAuthReady: backendAuthReady,
        adminUser,
        adminProfile,
        authLoading,
        authWorking,
        authError,
        isAdminAuthenticated: Boolean(adminUser && adminProfile),
        login,
        loginWithGoogle,
        logout,
        addRegularAdmin,
    };
};
exports.useAdminAuth = useAdminAuth;
