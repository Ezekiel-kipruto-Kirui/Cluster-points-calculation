export const getSourceLabel = (source: string): string => {
  if (source === "saved-session") return "Saved Session";
  if (source === "firebase-function") return "Firebase Function";
  return "Local Cluster Engine";
};

export const buildAccessCodeEmailMessage = ({ code }: { code: string }): string =>
  [
    "Your KUCCPS cluster calculation is ready.",
    "",
    `Access code: ${code}`,
    "",
    "Use this code on the home page to open your saved cluster points and continue course selection.",
  ].join("\n");

