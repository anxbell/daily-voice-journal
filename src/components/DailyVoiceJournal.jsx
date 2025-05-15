import React, { useState, useEffect, useRef } from "react";
import { Save, Mic, MicOff, BookOpen, Sun, Moon, Trash2, Edit, Copy, Check } from "lucide-react";
import './DailyVoiceJournal.css';

// Check if SpeechRecognition is available
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function DailyVoiceJournal() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
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
    
    // Stop recording if active
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
    if (editingId) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === editingId 
          ? { ...entry, text: currentEntry, edited: true } 
          : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      setEditingId(null);
    } else {
      // Create new entry
      const newEntry = {
        id: Date.now(),
        text: currentEntry,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    }
    
    setCurrentEntry("");
  };

  // Delete an entry
  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    
    // If deleting the entry being edited, clear the edit state
    if (editingId === id) {
      setEditingId(null);
      setCurrentEntry("");
    }
  };

  // Start editing an entry
  const editEntry = (entry) => {
    setCurrentEntry(entry.text);
    setEditingId(entry.id);
    
    // Stop recording if active
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setCurrentEntry("");
  };

  // Copy text to clipboard
  const copyToClipboard = (text, id = null) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
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
            <h2 className="section-title">
              {editingId ? "Edit Journal Entry" : "New Journal Entry"}
            </h2>
            <div className="button-group">
              {!editingId && (
                <button
                  onClick={toggleRecording}
                  className={`action-button ${isRecording ? "stop" : "record"}`}
                  disabled={!!editingId}
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
              )}
              
              <button
                onClick={saveEntry}
                disabled={!currentEntry.trim()}
                className={`action-button ${!currentEntry.trim() ? "disabled" : "save"}`}
              >
                <Save className="icon" /> Save
              </button>
              
              {currentEntry && (
                <button
                  onClick={() => copyToClipboard(currentEntry, 'current')}
                  className="action-button copy"
                >
                  {copiedId === 'current' ? (
                    <>
                      <Check className="icon" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="icon" /> Copy
                    </>
                  )}
                </button>
              )}
              
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="action-button cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          <div className="entry-content">
            {editingId ? (
              <textarea 
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                className="entry-textarea"
              />
            ) : currentEntry ? (
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
                  <div className="entry-header">
                    <p className="entry-timestamp">
                      {entry.timestamp}
                      {entry.edited && <span className="edited-indicator"> (edited)</span>}
                    </p>
                    <div className="entry-actions">
                      <button 
                        onClick={() => copyToClipboard(entry.text, entry.id)}
                        className="icon-button"
                        title="Copy to clipboard"
                      >
                        {copiedId === entry.id ? <Check className="icon" /> : <Copy className="icon" />}
                      </button>
                      <button 
                        onClick={() => editEntry(entry)}
                        className="icon-button"
                        title="Edit entry"
                      >
                        <Edit className="icon" />
                      </button>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="icon-button delete"
                        title="Delete entry"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </div>
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