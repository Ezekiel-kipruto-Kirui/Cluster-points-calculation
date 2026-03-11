import { useCallback, useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../lib/apiBase";
import type { AdminProfile } from "../lib/realtimeDb";

type AdminUser = {
  uid: string;
  email: string;
};

type AdminLoginResponse = {
  success: boolean;
  user?: AdminUser;
  profile?: AdminProfile;
  error: string;
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

const extractErrorMessage = (payload: any, fallback: string): string =>
  String(payload?.error || payload?.message || fallback).trim() || fallback;

type UseAdminAuthOptions = {
  enabled?: boolean;
};

export const useAdminAuth = ({ enabled = true }: UseAdminAuthOptions = {}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(enabled);
  const [authWorking, setAuthWorking] = useState(false);
  const [authError, setAuthError] = useState("");

  const backendAuthReady = useMemo(() => true, []);

  const loadCurrentAdmin = useCallback(async () => {
    setAuthLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/admin/me"), {
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
    } catch {
      setAdminUser(null);
      setAdminProfile(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setAuthLoading(false);
      return;
    }
    loadCurrentAdmin().catch(() => {});
  }, [enabled, loadCurrentAdmin]);

  const login = useCallback(async (email: string, password: string): Promise<AdminLoginResponse> => {
    setAuthWorking(true);
    setAuthError("");
    try {
      const response = await fetch(buildApiUrl("/api/admin/login"), {
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
        let message = extractErrorMessage(payload, `Authentication request failed (HTTP ${response.status}).`);
        if (response.status === 404 && message.startsWith("Authentication request failed")) {
          message = "Admin login endpoint not found. Check VITE_API_BASE_URL or backend routes.";
        }
        setAuthError(message);
        return { success: false, error: message };
      }

      setAdminUser(payload?.user || null);
      setAdminProfile(payload?.profile || null);
      setAuthError("");
      return { success: true, user: payload?.user || undefined, profile: payload?.profile || undefined, error: "" };
    } catch (error: any) {
      const message = error?.message || "Authentication request failed.";
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setAuthWorking(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<AdminLoginResponse> => {
    const message = "Google popup login is disabled in backend-auth mode. Use email and password.";
    setAuthError(message);
    return { success: false, error: message };
  }, []);

  const logout = useCallback(async () => {
    setAuthWorking(true);
    try {
      await fetch(buildApiUrl("/api/admin/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAdminUser(null);
      setAdminProfile(null);
      setAuthError("");
      setAuthWorking(false);
    }
  }, []);

  const addRegularAdmin = useCallback(
    async ({ email, password, name }: { email: string; password: string; name: string }) => {
      if (!adminUser || !adminProfile) {
        throw new Error("You must be logged in as admin.");
      }
      if (adminProfile.role !== "super") {
        throw new Error("Only a super admin can add regular admin users.");
      }

      const response = await fetch(buildApiUrl("/api/admin/regular-admin"), {
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
    },
    [adminProfile, adminUser],
  );

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
