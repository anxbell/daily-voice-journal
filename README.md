# Daily Voice Journal

## Personal Note

For assignments, I feel more comfortable getting my ideas together when they involve personal experiences or opinions. Sometimes when I focus only on speaking, ideas flow better—this project helps fix a small problem I’ve had during my college journey. It’s a practical tool that supports how I think and express myself more naturally.

## Description

A simple React application that lets you record and save voice journal entries using the Web Speech API.

## Features

- **Voice Recording**: Uses Web Speech API to capture voice input
- **Transcription**: Shows your spoken words in real-time
- **Journal Entries**: Saves entries with timestamps to localStorage
- **Dark/Light Mode**: Toggle between color themes
- **Responsive Design**: Works on any screen size
- **Modern UI**: Clean interface with soft colors and rounded cards

## Getting Started

### Prerequisites

- Node.js 
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Click the "Record" button to start voice recording
2. Speak your journal entry (you'll see text appear as you speak)
3. Click "Stop" when you're done
4. Click "Save" to store your entry
5. All saved entries appear in the "Past Entries" section
6. Toggle between light and dark mode with the sun/moon button

## Browser Compatibility

This app uses the Web Speech API, which is not supported in all browsers. For best results, use:

- Google Chrome
- Microsoft Edge
- Safari (iOS 14.5+ and macOS)
- Firefox (with settings enabled)

## Folder Structure

```
daily-voice-journal/
  ├── public/
  │   └── index.html
  ├── src/
  │   ├── components/
  │   │   ├── DailyVoiceJournal.jsx
  │   │   └── DailyVoiceJournal.css
  │   ├── App.jsx
  │   ├── index.js
  │   └── index.css
  ├── package.json
  └── README.md
```
## Acknowledgements/Resources

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React](https://reactjs.org/)
- [Lucide Icons](https://lucide.dev/)
