# Character Counter App

A real-time text analysis tool that provides comprehensive statistics including character count, word count, sentence count, reading time estimation, and letter frequency analysis. Built with vanilla JavaScript, featuring a responsive design and dark/light theme support.

![Character Counter App](./character-counter/assets/images/preview.jpg)

## 🚀 Features

- **Real-Time Text Analysis**: Instant updates as you type
- **Character Count**: Total characters with option to exclude spaces
- **Word Count**: Accurate word counting that handles multiple spaces
- **Sentence Count**: Detects sentences based on punctuation (. ! ?)
- **Reading Time**: Estimates reading time based on 200 WPM standard
- **Letter Density Analysis**: Visual representation of the top 5 most frequent letters with percentage bars
- **Theme Toggle**: Switch between light and dark modes with persistent preference
- **Responsive Design**: Optimized for all screen sizes from mobile to desktop
- **Clean Interface**: Modern, intuitive UI with smooth animations

## 📋 Table of Contents

- [Demo](#demo)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Features Breakdown](#features-breakdown)
- [Project Structure](#project-structure)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## 🎯 Demo

Visit the live application: [Character Counter App](https://character-counter-web-app.netlify.app/)

## 🛠 Technologies

- **HTML5**: Semantic markup structure
- **CSS3**:
  - CSS Custom Properties (variables) for theming
  - Flexbox for layouts
  - Media queries for responsive design
  - Transitions and animations
- **JavaScript (ES6+)**:
  - DOM manipulation
  - Event listeners
  - Regular expressions
  - localStorage API
  - JSDoc documentation

## 📥 Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: [Node.js](https://nodejs.org/) for running a local server

### Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Illona-addae/Character-Counter-app.git
   cd Character-Counter-app/character-counter
   ```

2. **Open in browser**

   **Option A: Direct file opening**

   ```bash
   open index.html
   ```

   **Option B: Using live-server (recommended)**

   ```bash
   # Install live-server globally
   npm install -g live-server

   # Run the server
   live-server
   ```

   **Option C: Using Python's built-in server**

   ```bash
   # Python 3
   python -m http.server 8000

   # Then open http://localhost:8000 in your browser
   ```

## 📖 Usage

1. **Start Typing**: Enter or paste text into the textarea
2. **View Statistics**: Real-time updates display:

   - Character count (with/without spaces)
   - Word count
   - Sentence count
   - Estimated reading time
   - Letter frequency analysis

3. **Customize Analysis**:

   - Check "Exclude Spaces" to count only visible characters
   - Toggle between light and dark themes using the theme button

4. **Clear and Reset**: Refresh the page to start with a clean slate (auto-clear on page load)

## 🔍 Features Breakdown

### Character Counter

- Counts all characters including spaces, punctuation, and special characters
- Optional "Exclude Spaces" mode for counting only visible characters
- Displays count with leading zeros for consistent formatting (e.g., "05", "42")

### Word Counter

- Intelligently handles multiple spaces between words
- Uses regex pattern `/\s+/` to split by one or more whitespace characters
- Returns "00" for empty input

### Sentence Counter

- Detects sentence-ending punctuation: period (.), exclamation mark (!), question mark (?)
- Treats text without punctuation as one incomplete sentence
- Empty input displays "00"

### Reading Time Calculator

- Based on average reading speed of 200 words per minute
- Rounds up using `Math.ceil()` to ensure non-zero display for short texts
- Shows "< 1" for texts under one minute

### Letter Density Analyzer

- Converts all letters to uppercase for unified counting
- Displays top 5 most frequent letters
- Visual progress bars showing percentage distribution
- Shows both count and percentage for each letter
- Empty state message when no text is entered

### Theme Toggle

- Persistent dark/light mode using localStorage
- Smooth color transitions
- Separate logos for each theme
- User preference saved across browser sessions

## 📁 Project Structure

```
Character-Counter-app/
├── character-counter/
│   ├── index.html           # Main HTML structure
│   ├── style.css            # Styles with responsive design
│   ├── script.js            # Application logic and event handlers
│   └── assets/
│       ├── fonts/
│       │   └── DM_Sans/     # Custom font files
│       └── images/          # SVG icons and patterns
│           ├── favicon-32x32.png
│           ├── icon-arrow-down.svg
│           ├── icon-moon.svg
│           ├── icon-sun.svg
│           ├── logo-dark-theme.svg
│           ├── logo-light-theme.svg
│           ├── pattern-character-count.svg
│           ├── pattern-word-count.svg
│           └── pattern-sentence-count.svg
├── README.md                # Project documentation
└── README-template.md       # Original template
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **375px**: Small mobile devices
- **376-480px**: Mobile devices
- **481-768px**: Large mobile/small tablets
- **769-1024px**: Tablets
- **1025-1440px**: Laptops/desktops
- **1441px+**: Large desktops

## 🧪 Code Quality

- **Comprehensive JSDoc documentation** for all functions
- **Professional inline comments** explaining complex logic
- **Early return patterns** for better code readability
- **Consistent naming conventions** (camelCase for variables, UPPERCASE for constants)
- **Modular function design** with single responsibilities

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Illona Addae**

- GitHub: [@Illona-addae](https://github.com/Illona-addae)
- Project: [Character-Counter-app](https://github.com/Illona-addae/Character-Counter-app)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from modern text analysis tools
- Font: DM Sans
- Icons: Custom SVG icons
- Built as part of AmaliTech training program

---

**Note**: This application processes all text locally in your browser. No data is sent to any server, ensuring complete privacy of your content.
