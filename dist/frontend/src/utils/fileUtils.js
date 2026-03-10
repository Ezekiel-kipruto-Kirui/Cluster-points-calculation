"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsText = void 0;
const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsText(file);
});
exports.readFileAsText = readFileAsText;
