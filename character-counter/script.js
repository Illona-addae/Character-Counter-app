// Character Counter App - IIFE Module Pattern
(function () {
  "use strict";

  const READING_SPEED = 200;

  // DOM References
  const DOM = {
    themeBtn: document.getElementById("themeBtn"),
    textInput: document.getElementById("text-input"),
    excludeSpace: document.getElementById("exclude-spaces"),
    characterLimitCheckbox: document.getElementById("set-character-lim"),
    characterLimitInput: document.getElementById("character-limit-input"),
    readingTime: document.getElementById("reading-time"),
    characterCount: document.getElementById("char-count"),
    wordCount: document.getElementById("word-count"),
    sentenceCount: document.getElementById("sentence-count"),
    densityList: document.getElementById("density-list"),
    seeMoreBtn: document.getElementById("see-more-btn"),
  };

  // Initialize app
  function init() {
    setupTheme();
    setupEventListeners();
    resetCounts();
  }

  function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  function setupEventListeners() {
    window.addEventListener("DOMContentLoaded", resetCounts);
    DOM.themeBtn.addEventListener("click", toggleTheme);
    DOM.textInput.addEventListener("input", updateAll);
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  function resetCounts() {
    DOM.textInput.value = "";
    DOM.characterCount.textContent = "00";
    DOM.wordCount.textContent = "00";
    DOM.sentenceCount.textContent = "00";
    DOM.readingTime.textContent = "0";
    DOM.densityList.innerHTML =
      '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
  }

  function updateAll() {
    const text = DOM.textInput.value;
    updateCharacterCount(text);
    updateWordCount(text);
    updateSentenceCount(text);
    updateReadingTime(text);
    updateLetterDensity(text);
  }

  function updateCharacterCount(text) {
    const count = DOM.excludeSpace.checked
      ? text.replace(/\s/g, "").length
      : text.length;
    DOM.characterCount.textContent = count.toString().padStart(2, "0");
  }

  function updateWordCount(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      DOM.wordCount.textContent = "00";
      return;
    }
    const words = trimmed.split(/\s+/);
    DOM.wordCount.textContent = words.length.toString().padStart(2, "0");
  }

  function updateSentenceCount(text) {
    if (text.trim() === "") {
      DOM.sentenceCount.textContent = "00";
      return;
    }
    const sentences = text.match(/[.!?]/g);
    const count = sentences ? sentences.length : text.trim() ? 1 : 0;
    DOM.sentenceCount.textContent = count.toString().padStart(2, "0");
  }

  function updateReadingTime(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      DOM.readingTime.textContent = "0";
      return;
    }
    const words = trimmed.split(/\s+/).length;
    const minutes = Math.ceil(words / READING_SPEED);
    DOM.readingTime.textContent = minutes < 1 ? "< 1" : minutes.toString();
  }

  function updateLetterDensity(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      DOM.densityList.innerHTML =
        '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
      return;
    }

    const letterCounts = countLetters(trimmed.toUpperCase());
    const sorted = Object.entries(letterCounts)
      .map(([letter, count]) => ({ letter, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const total = Object.values(letterCounts).reduce((sum, c) => sum + c, 0);

    DOM.densityList.innerHTML = sorted
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

  init();
})();
