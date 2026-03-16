import app from "../index";

const ensureApiPath = (req: any) => {
  if (!req?.url) return;
  const url = new URL(req.url, "http://localhost");
  const rawPath = url.searchParams.get("path");
  if (rawPath === null) return;

  url.searchParams.delete("path");
  const trimmed = String(rawPath || "").trim();
  const normalized = trimmed ? (trimmed.startsWith("/") ? trimmed : `/${trimmed}`) : "";
  const targetPath = trimmed.startsWith("/")
    ? normalized
    : normalized.startsWith("/api")
      ? normalized
      : `/api${normalized}`;
  const query = url.searchParams.toString();
  req.url = query ? `${targetPath}?${query}` : targetPath;
};

export default function handler(req: any, res: any) {
  ensureApiPath(req);
  return (app as any)(req, res);
}
