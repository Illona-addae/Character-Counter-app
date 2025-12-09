import assert from "node:assert/strict";
import { countSentences } from "../character-counter/scripts/text-metrics.js";

function run() {
  const cases = [
    { input: ".", expected: 0, desc: "single dot" },
    { input: "!!!", expected: 0, desc: "only punctuation" },
    { input: "Hello world.", expected: 1, desc: "simple sentence" },
    { input: "Hello . world", expected: 1, desc: "dot between words" },
    { input: "U.S.A.", expected: 1, desc: "abbreviation" },
    { input: "Привет мир", expected: 1, desc: "non-latin text" },
    { input: "", expected: 0, desc: "empty string" },
    { input: "No punctuation but words", expected: 1, desc: "no punctuation" },
  ];

  for (const c of cases) {
    const got = countSentences(c.input);
    try {
      assert.strictEqual(got, c.expected);
      console.log(`PASS: ${c.desc} -> ${got}`);
    } catch (err) {
      console.error(`FAIL: ${c.desc} -> got ${got}, expected ${c.expected}`);
      throw err;
    }
  }
  console.log("All sentence-count tests passed.");
}

run();
