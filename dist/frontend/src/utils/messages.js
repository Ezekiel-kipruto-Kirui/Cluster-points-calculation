"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAccessCodeEmailMessage = exports.getSourceLabel = void 0;
const getSourceLabel = (source) => {
    if (source === "saved-session")
        return "Saved Session";
    if (source === "firebase-function")
        return "Firebase Function";
    return "Local Cluster Engine";
};
exports.getSourceLabel = getSourceLabel;
const buildAccessCodeEmailMessage = ({ code }) => [
    "Your KUCCPS cluster calculation is ready.",
    "",
    `Access code: ${code}`,
    "",
    "Use this code on the home page to open your saved cluster points and continue course selection.",
].join("\n");
exports.buildAccessCodeEmailMessage = buildAccessCodeEmailMessage;
