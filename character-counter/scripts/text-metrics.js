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
  const words = trimmed.split(/\s+/);
  wordCountEl.textContent = words.length.toString().padStart(2, "0");
}
