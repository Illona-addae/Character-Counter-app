// Character Counter App - IIFE Module Pattern
// Encapsulated module: prevents global namespace pollution, all code runs immediately
import {
  updateCharacterCount,
  updateWordCount,
} from "./text-metrics.js";
import updateLetterDensity from "./letter-density.js";

(function () {
  "use strict";

  // Configuration constant: words per minute for reading time calculation
  const READING_SPEED = 200;

  // Small helper for DOM queries
  function getDocument(selectorName, type) {
    switch (type) {
      case "id":
        return document.getElementById(selectorName);
      case "class":
        return document.getElementsByClassName(selectorName);
      case "tag":
        return document.getElementsByTagName(selectorName);
      default:
        return null;
    }
  }

  // Centralized DOM references - cache selectors for performance
  const DOM = {
    themeBtn: getDocument("themeBtn", "id"),
    textInput: getDocument("text-input", "id"),
    excludeSpace: getDocument("exclude-spaces", "id"),
    characterLimitCheckbox: getDocument("set-character-lim", "id"),
    characterLimitInput: getDocument("character-limit-input", "id"),
    readingTime: getDocument("reading-time", "id"),
    characterCount: getDocument("char-count", "id"),
    wordCount: getDocument("word-count", "id"),
    sentenceCount: getDocument("sentence-count", "id"),
    densityList: getDocument("density-list", "id"),
    seeMoreBtn: getDocument("see-more-btn", "id"),
  };

  // Entry point: initialize theme, listeners, and UI
  function init() {
    setupTheme();
    setupEventListeners();
    resetCounts();
  }

  // Restore user's theme preference from localStorage on page load
  function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  // Attach all event listeners
  function setupEventListeners() {
    window.addEventListener("DOMContentLoaded", resetCounts);
    DOM.themeBtn.addEventListener("click", toggleTheme);
    DOM.textInput.addEventListener("input", updateAll);
  }

  // Toggle dark/light mode and persist choice
  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  // Clear textarea and reset all counters on page load
  function resetCounts() {
    DOM.textInput.value = "";
    DOM.characterCount.textContent = "00";
    DOM.wordCount.textContent = "00";
    DOM.sentenceCount.textContent = "00";
    DOM.readingTime.textContent = "0";
    DOM.densityList.innerHTML =
      '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
  }

  // Orchestrator: runs all update functions on text input
  function updateAll() {
    const text = DOM.textInput.value;
    updateCharacterCount(text, DOM.excludeSpace, DOM.characterCount);
    updateWordCount(text, DOM.wordCount);
    updateSentenceCount(text);
    updateReadingTime(text);
    updateLetterDensity(text, DOM.densityList);
  }

  // Detect sentences by punctuation marks (. ! ?)
  function updateSentenceCount(text) {
    if (text.trim() === "") {
      DOM.sentenceCount.textContent = "00";
      return;
    }
    const sentences = text.match(/[.!?]/g);
    const count = sentences ? sentences.length : text.trim() ? 1 : 0;
    DOM.sentenceCount.textContent = count.toString().padStart(2, "0");
  }

  // Calculate reading time: Math.ceil(words / 200 WPM)
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

  // Invoke module immediately on page load
  init();
})();
