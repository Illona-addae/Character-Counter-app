// Imports
import {
  updateCharacterCount,
  updateWordCount,
  countSentences,
} from "./scripts/text-metrics.js";
import updateLetterDensity from "./scripts/letter-density.js";

// App module (IIFE)
(function () {
  "use strict";

  // Reading speed (words per minute) used for reading time estimate
  const READING_SPEED = 200;

  // Simple DOM helper
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

  // DOM cache
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
  // Initialization
  function init() {
    setupTheme();
    setupEventListeners();
    // If the HTML had the checkbox pre-checked (e.g., from server-side),
    // initialize the limit state so enforcement is consistent on load.
    if (DOM.characterLimitCheckbox && DOM.characterLimitCheckbox.checked) {
      limitEnabled = true;
      if (DOM.characterLimitInput) {
        // ensure the input is editable and parse any prefilled value
        DOM.characterLimitInput.disabled = false;
        parseAndApplyLimit(DOM.characterLimitInput.value);
      }
    }
    // Reset counters to defaults
    resetCounts();
  }
  // Apply saved theme
  function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }
  // Wire event listeners
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
  // Create the limit input if missing
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
    // start visually hidden when created; index.html will normally include
    // a visible input, but this covers the missing-markup case.
    input.className = "limit-input hidden";
    input.value = "300"; // default value; user should overwrite this
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
  let characterLimit = null;
  let limitEnabled = false;

  // Checkbox handler: toggle enforcement and parse current input
  function onCharacterLimitToggle(e) {
    limitEnabled = !!e.target.checked;
    // we keep the input editable at all times; only enforcement is enabled/disabled
    if (!limitEnabled) {
      // turning the checkbox off removes the active limit
      characterLimit = null;
    } else {
      // parse current value and focus the control so the user can adjust it
      parseAndApplyLimit(
        DOM.characterLimitInput && DOM.characterLimitInput.value
      );
      try {
        DOM.characterLimitInput.focus();
        DOM.characterLimitInput.select();
      } catch (err) {
        /* ignore: focus/select may fail in some contexts */
      }
    }
  }

  function onCharacterLimitChange(e) {
    parseAndApplyLimit(e.target.value);
  }
  // Parse and apply numeric limit
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

  // Enforce the current character limit by truncating textarea value
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

  // Toggle theme and persist
  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  // Reset counters and textarea
  function resetCounts() {
    DOM.textInput.value = "";
    DOM.characterCount.textContent = "00";
    DOM.wordCount.textContent = "00";
    DOM.sentenceCount.textContent = "00";
    DOM.readingTime.textContent = "0";
    DOM.densityList.innerHTML = "";
  }

  // Run all metric updates (called on input)
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

  // Update sentence counter
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
