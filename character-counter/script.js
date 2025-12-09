// Module Imports
import {
  updateCharacterCount,
  updateWordCount,
  countSentences,
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
    // Initialize character limit UI state based on current checkbox/input
    if (DOM.characterLimitCheckbox && DOM.characterLimitCheckbox.checked) {
      limitEnabled = true;
      if (DOM.characterLimitInput) {
        DOM.characterLimitInput.classList.toggle("hidden", false);
        parseAndApplyLimit(DOM.characterLimitInput.value);
      }
    }

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
    // Character limit controls
    if (DOM.characterLimitCheckbox) {
      DOM.characterLimitCheckbox.addEventListener(
        "change",
        onCharacterLimitToggle
      );
    }
    if (DOM.characterLimitInput) {
      DOM.characterLimitInput.addEventListener("input", onCharacterLimitChange);
    }
  }

  // Ensure the character limit input exists in the DOM. Some pages
  // (or earlier edits) might not include it; create and insert it
  // next to the checkbox so users always have the control.
  function ensureCharacterLimitInput() {
    if (DOM.characterLimitInput) return;
    const checkbox = document.getElementById("set-character-lim");
    if (!checkbox) return;
    // find the parent .check-item to append the input into
    const parent = checkbox.closest(".check-item") || checkbox.parentNode;
    if (!parent) return;
    const input = document.createElement("input");
    input.type = "number";
    input.id = "character-limit-input";
    input.className = "limit-input hidden";
    input.value = "300";
    input.min = "1";
    input.placeholder = "300";
    input.title = "Character limit";
    input.setAttribute("aria-label", "Character limit");
    parent.appendChild(input);
    // update DOM cache and wire events
    DOM.characterLimitInput = document.getElementById("character-limit-input");
    if (DOM.characterLimitInput) {
      DOM.characterLimitInput.addEventListener("input", onCharacterLimitChange);
    }
  }

  // Character limit state
  let characterLimit = null; // integer or null
  let limitEnabled = false;

  function onCharacterLimitToggle(e) {
    limitEnabled = !!e.target.checked;
    // show or hide the number input
    if (DOM.characterLimitInput) {
      DOM.characterLimitInput.classList.toggle("hidden", !limitEnabled);
    }
    if (!limitEnabled) {
      characterLimit = null;
    } else {
      // parse current value
      parseAndApplyLimit(DOM.characterLimitInput && DOM.characterLimitInput.value);
      // focus and select the input so user can type immediately
      try {
        DOM.characterLimitInput.focus();
        DOM.characterLimitInput.select();
      } catch (err) {
        /* ignore */
      }
    }
  }

  function onCharacterLimitChange(e) {
    parseAndApplyLimit(e.target.value);
  }

  function parseAndApplyLimit(val) {
    const n = Number(String(val).trim());
    if (Number.isInteger(n) && n > 0) {
      characterLimit = n;
      // enforce immediately in case current text already exceeds the limit
      enforceCharacterLimit();
    } else {
      characterLimit = null;
    }
  }

  function enforceCharacterLimit() {
    if (!limitEnabled || !characterLimit || !DOM.textInput) return;
    const current = DOM.textInput.value || "";
    if (current.length > characterLimit) {
      DOM.textInput.value = current.slice(0, characterLimit);
      // move caret to end so typing continues naturally
      try {
        DOM.textInput.setSelectionRange(characterLimit, characterLimit);
      } catch (e) {
        // ignore if not supported
      }
    }
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
    // Enforce limit (this may trim the textarea value)
    enforceCharacterLimit();

    const text = DOM.textInput.value;
    updateCharacterCount(text, DOM.excludeSpace, DOM.characterCount);
    updateWordCount(text, DOM.wordCount);
    updateSentenceCount(text);
    updateReadingTime(text);
    updateLetterDensity(text, DOM.densityList);
  }

  function updateSentenceCount(text) {
    const count = countSentences(text);
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
