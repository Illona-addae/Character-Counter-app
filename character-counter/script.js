// Module Imports
import {
  updateCharacterCount,
  updateWordCount,
} from "./scripts/text-metrics.js";
import updateLetterDensity from "./scripts/letter-density.js";

(function () {
  "use strict";

  const READING_SPEED = 200;

  //   DOM Helper and DOM cache
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

  // DOM object
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
  };

  // Initialization Flow
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

  //  Event Wiring
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
    DOM.densityList.innerHTML = "";
  }

  function updateAll() {
    const text = DOM.textInput.value;
    updateCharacterCount(text, DOM.excludeSpace, DOM.characterCount);
    updateWordCount(text, DOM.wordCount);
    updateSentenceCount(text);
    updateReadingTime(text);
    updateLetterDensity(text, DOM.densityList);
  }

  function updateSentenceCount(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      DOM.sentenceCount.textContent = "00";
      return;
    }
    // Match sentence-ending punctuation sequences that are preceded by an
    // alphanumeric character and followed by whitespace or end-of-string.
    // This avoids counting standalone punctuation (like "." or "...") or
    // punctuation inside abbreviations (e.g. "U.S.A.") as sentence boundaries.
    const matches = trimmed.match(/[\p{L}\p{N}][.!?]+(?=\s|$)/gu);
    const hasWordChar = /[\p{L}\p{N}]/u.test(trimmed);
    const count = matches ? matches.length : hasWordChar ? 1 : 0;
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

  init();
})();
