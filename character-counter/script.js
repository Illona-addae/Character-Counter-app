// console.log("JS link properly");
const themeBtn = document.getElementById("themeBtn");

// Get users local load save theme
const userTheme = localStorage.getItem("theme");
console.log(userTheme);
if (userTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// Toggle on button click
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  document.body.classList.contains("dark-mode")
    ? localStorage.setItem("theme", "dark")
    : localStorage.setItem("theme", "light");
});
