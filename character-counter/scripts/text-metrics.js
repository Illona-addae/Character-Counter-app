// Text metrics helpers: character and word counts
export function updateCharacterCount(
  text,
  excludeSpaceCheckbox,
  characterCountEl
) {
  const count = excludeSpaceCheckbox.checked
    ? text.replace(/\s/g, "").length
    : text.length;
  characterCountEl.textContent = count.toString().padStart(2, "0");
}

export function updateWordCount(text, wordCountEl) {
  const trimmed = text.trim();
  if (trimmed === "") {
    wordCountEl.textContent = "00";
    return;
  }
  // Split on whitespace, then filter out tokens that contain at least one
  // alphanumeric character. This prevents counting standalone punctuation
  // (e.g. ".", "--", "***") as words.
  const tokens = trimmed.split(/\s+/);
  // Use Unicode-aware letter/number detection so accented and non-Latin
  // characters count as words. The 'u' flag enables Unicode property
  // escapes and broader character support in modern browsers.
  const words = tokens.filter((t) => /[\p{L}\p{N}]/u.test(t));
  wordCountEl.textContent = words.length.toString().padStart(2, "0");
}

// A pure function that returns the number of sentences in `text`.
// It uses a Unicode-aware regex to detect sentence-ending punctuation
// that is preceded by a letter/number and followed by whitespace or end
// of string. This avoids counting standalone punctuation as sentences.
export function countSentences(text) {
  const trimmed = String(text || "").trim();
  if (trimmed === "") return 0;
  const matches = trimmed.match(/[\p{L}\p{N}][.!?]+(?=\s|$)/gu);
  const hasWordChar = /[\p{L}\p{N}]/u.test(trimmed);
  const count = matches ? matches.length : hasWordChar ? 1 : 0;
  return count;
}
