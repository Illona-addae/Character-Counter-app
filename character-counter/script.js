// ========================================
// DOM ELEMENT REFERENCES
// ========================================
// Selecting all necessary HTML elements using getElementById for manipulation
const themeBtn = document.getElementById("themeBtn");
const textInput = document.getElementById("text-input");
const excludeSpace = document.getElementById("exclude-spaces");
const characterLimitCheckbox = document.getElementById("set-character-lim");
const characterLimitInput = document.getElementById("character-limit-input");
const readingTime = document.getElementById("reading-time");
const characterCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const sentenceCount = document.getElementById("sentence-count");
const densityList = document.getElementById("density-list");
const seeMoreBtn = document.getElementById("see-more-btn");

// ========================================
// INITIALIZE APP ON PAGE LOAD
// ========================================
// Clear textarea and reset all counters when page loads/refreshes
// This ensures users always start with a clean slate
window.addEventListener("DOMContentLoaded", () => {
  textInput.value = ""; // Clear any cached text in textarea
  characterCount.textContent = "00";
  wordCount.textContent = "00";
  sentenceCount.textContent = "00";
  readingTime.textContent = "0";
  densityList.innerHTML =
    '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
});

// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================
// Retrieve user's saved theme preference from localStorage
// This persists the theme choice across browser sessions
const userTheme = localStorage.getItem("theme");

// Apply dark mode if it was the user's last choice
if (userTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// Listen for theme button clicks to toggle between light and dark modes
themeBtn.addEventListener("click", () => {
  // Toggle the dark-mode class on the body element
  document.body.classList.toggle("dark-mode");

  // Save the new theme preference to localStorage
  // Ternary operator: if dark-mode exists, save "dark", otherwise save "light"
  document.body.classList.contains("dark-mode")
    ? localStorage.setItem("theme", "dark")
    : localStorage.setItem("theme", "light");
});

// ========================================
// CONFIGURATION CONSTANTS
// ========================================
// Average reading speed in words per minute (industry standard)
// Used for calculating estimated reading time
const READING_SPEED = 200;

// ========================================
// MAIN TEXT INPUT EVENT LISTENER
// ========================================
// Listen for 'input' event which fires on every keystroke
// This provides real-time updates as the user types
textInput.addEventListener("input", () => {
  const text = textInput.value; // Get current textarea content

  // Call all counting functions to update the UI in real-time
  updateCharacterCount(text);
  updateWordCount(text);
  updateSentenceCount(text);
  updateReadingTime(text);
  updateLetterDensity(text);
});

// ========================================
// CHARACTER COUNT FUNCTION
// ========================================
/**
 * Counts total characters in the text
 * Handles two modes: with spaces and without spaces
 * @param {string} text - The text from the textarea
 */
function updateCharacterCount(text) {
  let count;

  // Check if "Exclude Spaces" checkbox is checked
  if (excludeSpace.checked) {
    // REGEX EXPLANATION: /\s/g
    // \s = matches any whitespace character (space, tab, newline)
    // g = global flag (finds ALL matches, not just the first one)
    // .replace(/\s/g, '') removes all whitespace, leaving only visible characters
    count = text.replace(/\s/g, "").length;
  } else {
    // .length property returns the total number of characters including spaces
    count = text.length;
  }

  // Update the display with leading zeros for consistent formatting
  // .padStart(2, '0') ensures minimum 2 digits: 5 becomes "05", 42 stays "42"
  characterCount.textContent = count.toString().padStart(2, "0");
}

// ========================================
// WORD COUNT FUNCTION
// ========================================
/**
 * Counts the number of words in the text
 * Handles multiple spaces between words correctly
 * @param {string} text - The text from the textarea
 */
function updateWordCount(text) {
  // STEP 1: Clean the text
  // .trim() removes whitespace from the beginning and end of the string
  // This prevents empty spaces from being counted as words
  const trimmedText = text.trim();

  // STEP 2: Handle edge case - empty input
  // If user deletes all text, show "00" instead of "01"
  if (trimmedText === "") {
    wordCount.textContent = "00";
    return; // Exit function early (no need to process further)
  }

  // STEP 3: Split text into words using regex
  // REGEX EXPLANATION: /\s+/
  // \s = matches any whitespace character
  // + = one or more occurrences
  // This handles multiple spaces correctly: "Hello  world" → ["Hello", "world"]
  // Using ' ' (single space) would create empty strings with multiple spaces
  const words = trimmedText.split(/\s+/);

  // STEP 4: Update the display with formatted count
  wordCount.textContent = words.length.toString().padStart(2, "0");
}

// ========================================
// SENTENCE COUNT FUNCTION
// ========================================
/**
 * Counts sentences based on punctuation marks (. ! ?)
 * Text without punctuation is considered 1 sentence if not empty
 * @param {string} text - The text from the textarea
 */
function updateSentenceCount(text) {
  // Handle empty textarea - show "00" when no text is entered
  if (text.trim() === "") {
    sentenceCount.textContent = "00";
    return; // Exit early to avoid unnecessary processing
  }

  // REGEX EXPLANATION: /[.!?]/g
  // [...] = character class (matches any ONE of the characters inside)
  // .!? = the three sentence-ending punctuation marks
  // g = global flag (finds all matches in the string)
  // .match() returns an array of all matches, or null if none found
  const sentences = text.match(/[.!?]/g);

  // TERNARY LOGIC BREAKDOWN:
  // If sentences exist: use sentences.length
  // If sentences is null BUT text exists: count as 1 sentence (incomplete sentence)
  // If both are false: count as 0
  const count = sentences ? sentences.length : text.trim() ? 1 : 0;

  // Update display with consistent two-digit formatting
  sentenceCount.textContent = count.toString().padStart(2, "0");
}

// ========================================
// READING TIME CALCULATION FUNCTION
// ========================================
/**
 * Calculates estimated reading time based on average reading speed
 * Formula: (word count ÷ words per minute) rounded up
 * @param {string} text - The text from the textarea
 */
function updateReadingTime(text) {
  const trimmedText = text.trim();

  // If textarea is empty, reading time is 0 minutes
  if (trimmedText === "") {
    readingTime.textContent = "0";
    return; // Exit early
  }

  // Count words using the same logic as updateWordCount
  // Split by one or more whitespace characters to handle multiple spaces
  const words = trimmedText.split(/\s+/);
  const wordCountNum = words.length;

  // Calculate reading time using Math.ceil for rounding up
  // Math.ceil() always rounds UP to the nearest whole number
  // Example: 0.025 minutes (5 words ÷ 200) becomes 1 minute
  // This ensures even short texts show some reading time
  const minutes = Math.ceil(wordCountNum / READING_SPEED);

  // Format the output based on calculated minutes
  // Show "< 1" for very short texts, otherwise show the number
  if (minutes < 1) {
    readingTime.textContent = "< 1";
  } else {
    readingTime.textContent = minutes.toString();
  }
}

// ========================================
// LETTER DENSITY ANALYSIS FUNCTION
// ========================================
/**
 * Analyzes letter frequency and displays top 5 most common letters
 * Steps: Count letters → Convert to array → Sort → Calculate percentages → Generate HTML
 * @param {string} text - The text from the textarea
 */
function updateLetterDensity(text) {
  // STEP 0: Handle empty textarea first to avoid unnecessary processing
  if (text.trim() === "") {
    densityList.innerHTML =
      '<p class="empty-message">No characters found. Start typing to see letter density.</p>';
    return; // Exit early if no text to analyze
  }

  // STEP 1: COUNT EACH LETTER
  // Convert to uppercase so 'A' and 'a' are counted together
  const textToUpperCase = text.trim().toUpperCase();

  // Create an empty object to store letter counts
  // Structure will be: { A: 5, B: 2, C: 7, ... }
  const letterCounts = {};

  // Loop through each character in the text
  for (let char of textToUpperCase) {
    // Check if character is a letter (A-Z) using regex
    // This excludes numbers, spaces, and punctuation
    if (char.match(/[A-Z]/)) {
      // If letter already exists in object, increment its count
      if (letterCounts[char]) {
        letterCounts[char]++;
      } else {
        // If it's a new letter, initialize count to 1
        letterCounts[char] = 1;
      }
    }
  }

  // STEP 2: CONVERT OBJECT TO ARRAY OF OBJECTS
  // Object.entries() converts { E: 40, I: 29 } to [ ['E', 40], ['I', 29] ]
  // .map() transforms each entry into an object with 'letter' and 'count' properties
  const letterArray = Object.entries(letterCounts).map((entry) => {
    return {
      letter: entry[0], // entry[0] is the letter (key)
      count: entry[1], // entry[1] is the count (value)
    };
  });

  // STEP 3: SORT BY FREQUENCY (highest to lowest)
  // Sort comparison: b.count - a.count
  // If result is positive: b comes before a (descending order)
  // Example: b=5, a=3 → 5-3=2 (positive) → b before a ✓
  letterArray.sort((a, b) => b.count - a.count);

  // STEP 4: GET TOP 5 MOST FREQUENT LETTERS
  // .slice(0, 5) extracts first 5 elements from sorted array
  // If less than 5 letters exist, it returns all available letters
  const top5 = letterArray.slice(0, 5);

  // STEP 5: CALCULATE TOTAL LETTERS FOR PERCENTAGE
  // Object.values() gets all counts: { E: 40, I: 29 } → [40, 29]
  // .reduce() sums them: (0 + 40 + 29) = 69 total letters
  const totalLetters = Object.values(letterCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // STEP 6: CLEAR PREVIOUS CONTENT
  // Remove old letter items before adding new ones
  densityList.innerHTML = "";

  // STEP 7: CREATE AND DISPLAY HTML FOR EACH LETTER
  // Loop through top 5 letters and generate visual representation
  top5.forEach((item) => {
    // Calculate percentage: (individual count ÷ total) × 100
    // Example: (40 ÷ 100) × 100 = 40%
    const percentage = (item.count / totalLetters) * 100;

    // Create HTML string using template literals
    // ${} syntax inserts JavaScript values into the HTML
    const html = `
      <div class="letter-item">
        <span class="letter">${item.letter}</span>
        <div class="progress-bar">
          <div class="fill" style="width: ${percentage}%"></div>
        </div>
        <span class="percentage">${item.count} (${percentage.toFixed(
      2
    )}%)</span>
      </div>
    `;

    // Append new HTML to the density list
    // += adds to existing content instead of replacing it
    densityList.innerHTML += html;
  });
}
