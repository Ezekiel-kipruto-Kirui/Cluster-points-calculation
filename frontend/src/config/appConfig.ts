export const GRADE_OPTIONS = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

const parseNumberEnv = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const rawPayableAmount = String(
  import.meta.env.PAYABLE_AMOUNT || import.meta.env.VITE_PAYABLE_AMOUNT || "",
).trim();

export const PAYABLE_AMOUNT = parseNumberEnv(rawPayableAmount, 150);
export const SUPER_ADMIN_EMAIL = "";
