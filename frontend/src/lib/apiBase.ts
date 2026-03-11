const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizeApiBase = (value: string) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (isAbsoluteUrl(trimmed)) return trimmed.replace(/\/+$/, "");
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

const rawApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim();
const normalizedApiBase = normalizeApiBase(rawApiBase);

const getBasePath = (value: string) => {
  if (!value) return "";
  if (isAbsoluteUrl(value)) {
    try {
      return new URL(value).pathname.replace(/\/+$/, "") || "";
    } catch {
      return "";
    }
  }
  return value.startsWith("/") ? value.replace(/\/+$/, "") : "";
};

const dedupeBasePath = (base: string, path: string) => {
  if (!base) return path;
  const basePath = getBasePath(base);
  if (!basePath || basePath === "/") return path;
  const lowerBase = basePath.toLowerCase();
  const lowerPath = path.toLowerCase();
  if (lowerPath === lowerBase) return "";
  if (lowerPath.startsWith(`${lowerBase}/`)) {
    return path.slice(basePath.length);
  }
  return path;
};

export const buildApiUrl = (path: string) => {
  const trimmedPath = String(path || "").trim();
  if (!trimmedPath) return normalizedApiBase || "";
  if (isAbsoluteUrl(trimmedPath)) return trimmedPath;
  if (!normalizedApiBase) return trimmedPath;
  const normalizedPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
  const dedupedPath = dedupeBasePath(normalizedApiBase, normalizedPath);
  if (!dedupedPath) return normalizedApiBase;
  return `${normalizedApiBase}${dedupedPath.startsWith("/") ? dedupedPath : `/${dedupedPath}`}`;
};

export const getApiBaseUrl = () => normalizedApiBase;

const toRelativePath = (value: string) => {
  const trimmed = String(value || "").trim();
  if (!trimmed || isAbsoluteUrl(trimmed)) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const fetchApi = async (path: string, init?: RequestInit) => {
  const primaryUrl = buildApiUrl(path);
  const response = await fetch(primaryUrl, init);
  if (response.status !== 404) return response;

  const fallbackPath = toRelativePath(path);
  if (!fallbackPath || fallbackPath === primaryUrl) return response;
  return fetch(fallbackPath, init);
};
