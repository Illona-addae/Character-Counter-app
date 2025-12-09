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
