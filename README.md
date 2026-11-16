# IEC PathFinder

## Overview

IEC PathFinder is a responsive 5-step academic advising and course registration web portal built for high school students (Grades 10–12). The application guides students through entering their profile details, selecting their grade and section, choosing period-specific courses across AP, EST, and National tracks, opting into external exams, and reviewing their schedule before submitting directly to Google Sheets.

The project demonstrates front-end state management, dynamic period-based course filtering, real-time search, inline summary editing, duplicate-submission prevention, and serverless data integration via Google Apps Script.

## Features

### Student Profile & Grade Selection
- First and last name entry with floating labels and real-time input validation
- Gender selection (`Male` / `Female`) with personalized course sorting
- Grade (`10`, `11`, `12`) and section (`A`, `B`, `C`) accordion selector
- Automatic schedule adjustment when changing grade levels

### Course Selection & Search
- Dynamic period progression tailored to student grade level (Grade 10: Period 3; Grade 11: Periods 2–3; Grade 12: Periods 1–3)
- Category tab switching across `AP`, `EST`, and `National` offerings
- Live course search bar with expandable results and independent per-period scroll memory
- Automatic exclusion of courses already selected in other periods
- Grade-specific enrollment rules (mandatory selections for Grades 10–11; minimum 2 courses required for Grade 12)

### External Exams & Schedule Review
- Dynamic external exam opt-in cards for enrolled courses
- Singular and plural prompt adaptation (`Will you test for this course?` vs. `Which courses will you test for?`)
- Interactive Step 5 summary view allowing inline edits to name, gender, grade/section, courses, and exam choices
- Automatic Grade 12 equivalency detection based on course load

### Submission & Reliability
- Direct `POST` submission to Google Sheets via Google Apps Script
- Synchronous submission lock and pointer-event blocking to prevent duplicate entries from rapid tapping
- 50-second `AbortController` timeout handling with automatic retry state on network failure
- Post-submission UI lock to preserve submitted schedule confirmation

### Technical Features
- Vanilla JavaScript state machine (`studentProfile`, `periodCategoryMemory`, `categoryScrollPositions`)
- Dynamic DOM rendering and step transitions
- Animated progress bar and responsive mobile-first layout
- Custom CSS keyframe animations and micro-interactions
- Tailwind CSS utility styling paired with custom design tokens
- Device type detection and persistent browser device identifier (`localStorage`)

## Project Structure

```text
iec-pathfinder/
├── index.html
├── script.js
└── styles.css
```

## How to Run

1. Clone this repository:

```bash
git clone [https://github.com/abdelhadibarakat/iec-pathfinder.git](https://github.com/abdelhadibarakat/iec-pathfinder.git)
```

2. Navigate to the project directory:

```bash
cd iec-pathfinder
```

3. Configure your Google Apps Script Web App URL in `script.js`:

```javascript
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```

4. Open `index.html` in any modern web browser (or serve it locally using VS Code Live Server).

## Technologies

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6+)
- Google Apps Script (Google Sheets Integration)

## What I Learned

- Managing multi-step application state and navigation history in vanilla JavaScript
- Implementing dynamic filtering and validation rules tailored to grade levels and periods
- Building responsive, mobile-friendly interfaces with custom CSS animations and Tailwind CSS
- Preventing race conditions and duplicate form submissions under real-world student traffic
- Integrating client-side web applications with serverless Google Apps Script endpoints
- Designing intuitive inline edit flows from a final review summary screen

## License

Copyright (c) 2026 Abdelhadi Barakat. All Rights Reserved. This project is proprietary and intended for portfolio viewing only.
