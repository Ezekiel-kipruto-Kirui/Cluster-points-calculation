const rawApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim();
const normalizedApiBase = rawApiBase.replace(/\/+$/, "");

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export const buildApiUrl = (path: string) => {
  const trimmedPath = String(path || "").trim();
  if (!trimmedPath) return normalizedApiBase || "";
  if (isAbsoluteUrl(trimmedPath)) return trimmedPath;
  if (!normalizedApiBase) return trimmedPath;
  const normalizedPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
  return `${normalizedApiBase}${normalizedPath}`;
};

export const getApiBaseUrl = () => normalizedApiBase;
