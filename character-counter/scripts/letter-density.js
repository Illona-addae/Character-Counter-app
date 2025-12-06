// Letter density module: export a function to render top letters
export default function updateLetterDensity(text, densityList) {
  const trimmed = text.trim();
  if (trimmed === "") {
    densityList.innerHTML =
      '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
    return;
  }

  const letterCounts = countLetters(trimmed.toUpperCase());
  const sorted = Object.entries(letterCounts)
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const total = Object.values(letterCounts).reduce((sum, c) => sum + c, 0);

  densityList.innerHTML = sorted
    .map((item) => {
      const percentage = ((item.count / total) * 100).toFixed(2);
      return `
        <div class="letter-item">
          <span class="letter">${item.letter}</span>
          <div class="progress-bar">
            <div class="fill" style="width: ${percentage}%"></div>
          </div>
          <span class="percentage">${item.count} (${percentage}%)</span>
        </div>
      `;
    })
    .join("");
}

function countLetters(text) {
  const counts = {};
  for (const char of text) {
    if (/[A-Z]/.test(char)) {
      counts[char] = (counts[char] || 0) + 1;
    }
  }
  return counts;
}
