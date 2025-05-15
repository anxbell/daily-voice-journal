import { useState, useEffect, useRef } from "react";
import { Save, Mic, MicOff, BookOpen, Sun, Moon } from "lucide-react";
import './DailyVoiceJournal.css';

// Check if SpeechRecognition is available
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function DailyVoiceJournal() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const recognitionRef = useRef(null);

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentEntry(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle start/stop recording
  const toggleRecording = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setCurrentEntry("");
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  // Save current entry
  const saveEntry = () => {
    if (currentEntry.trim() === "") return;
    
    const newEntry = {
      id: Date.now(),
      text: currentEntry,
      timestamp: new Date().toLocaleString()
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    setCurrentEntry("");
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="journal-container">
        {/* Header */}
        <header className="journal-header">
          <h1 className="app-title">
            <BookOpen className="icon" />
            Daily Voice Journal
          </h1>
          <button 
            onClick={toggleDarkMode}
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </header>

        {/* Recording Section */}
        <div className="entry-card">
          <div className="entry-header">
            <h2 className="section-title">New Journal Entry</h2>
            <div className="button-group">
              <button
                onClick={toggleRecording}
                className={`action-button ${isRecording ? "stop" : "record"}`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="icon" /> Stop
                  </>
                ) : (
                  <>
                    <Mic className="icon" /> Record
                  </>
                )}
              </button>
              <button
                onClick={saveEntry}
                disabled={!currentEntry.trim()}
                className={`action-button ${!currentEntry.trim() ? "disabled" : "save"}`}
              >
                <Save className="icon" /> Save
              </button>
            </div>
          </div>
          
          <div className="entry-content">
            {currentEntry ? (
              <p>{currentEntry}</p>
            ) : (
              <p className="placeholder-text">
                {isRecording 
                  ? "Listening... Start speaking to see your words appear here." 
                  : "Press 'Record' and start speaking to create a new journal entry."}
              </p>
            )}
          </div>
          
          {isRecording && (
            <div className="recording-indicator">
              <div className="recording-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Past Entries */}
        <div className="past-entries">
          <h2 className="section-title">Past Entries</h2>
          {entries.length === 0 ? (
            <div className="entry-card empty-state">
              <p className="placeholder-text">
                No journal entries yet. Start recording to create your first entry!
              </p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map(entry => (
                <div 
                  key={entry.id}
                  className="entry-card"
                >
                  <p className="entry-timestamp">{entry.timestamp}</p>
                  <p className="entry-text">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyVoiceJournal;