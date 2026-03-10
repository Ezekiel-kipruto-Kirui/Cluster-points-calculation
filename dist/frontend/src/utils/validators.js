"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = exports.isValidEmail = void 0;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (value) => emailRegex.test(String(value || "").trim());
exports.isValidEmail = isValidEmail;
const normalizePhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0"))
        return `254${digits.slice(1)}`;
    if (digits.length === 9 && digits.startsWith("7"))
        return `254${digits}`;
    if (digits.length === 12 && digits.startsWith("254"))
        return digits;
    return null;
};
exports.normalizePhone = normalizePhone;
