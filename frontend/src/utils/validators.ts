const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => emailRegex.test(String(value || "").trim());

export const normalizePhone = (value: string): string | null => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("7")) return `254${digits}`;
  if (digits.length === 12 && digits.startsWith("254")) return digits;
  return null;
};

