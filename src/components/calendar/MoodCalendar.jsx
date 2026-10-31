import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../styles/calendar.css";

const getMoodEmoji = (mood) => {
  const moods = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    calm: "🌿",
    relaxed: "🧘",
    anxious: "😰",
    stressed: "😣",
    bored: "🥱",
    lonely: "😔",
    guilty: "😓",
    confused: "😕",
    fearful: "😨",
  };

  return moods[mood.trim().toLowerCase()] || "💌";
};

const MoodCalendar = ({ notes, onNotesChange, onDateSelect }) => {
  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    } catch {
      return [];
    }
  });

  const [selectedNote, setSelectedNote] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  // Open the note editor when a date is clicked
  const handleDateClick = (info) => {
    const previousNote = notes[info.dateStr] || "";

    setSelectedNote({
      date: info.dateStr,
      text: previousNote,
      mode: "edit",
    });

    setNoteInput(previousNote);
  };

  // Save the note
  const handleSaveNote = () => {
    if (!selectedNote) return;

    const date = selectedNote.date;
    const trimmedNote = noteInput.trim();

    const updatedNotes = { ...notes };
    let updatedEvents = events.filter((event) => event.start !== date);

    if (trimmedNote) {
      updatedNotes[date] = trimmedNote;

      updatedEvents.push({
        title: getMoodEmoji(trimmedNote),
        start: date,
        allDay: true,
        textColor: "black",
        extendedProps: {
          note: trimmedNote,
        },
      });
    } else {
      delete updatedNotes[date];
    }

    setEvents(updatedEvents);
    onNotesChange(updatedNotes);
    onDateSelect(date);

    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));

    localStorage.setItem("calendarNotes", JSON.stringify(updatedNotes));

    setSelectedNote(null);
    setNoteInput("");
  };

  // Open saved note when an event is clicked
  const handleEventClick = (info) => {
    const date = info.event.startStr.slice(0, 10);
    const note = notes[date] || info.event.extendedProps?.note || "";

    setSelectedNote({
      date,
      text: note,
      mode: "view",
    });

    setNoteInput(note);
  };

  const closePopup = () => {
    setSelectedNote(null);
    setNoteInput("");
  };

  return (
    <section className="mood-calendar-card">
      <div className="mood-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "",
            center: "title",
            right: "prev,next",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          displayEventTime={false}
          height="auto"
        />
      </div>

      <p className="calendar-instruction">
        ✿ Click any date to add or edit your mood.
        <br />
        💌 Click an emoji to read your note.
      </p>

      {/* Note Popup */}
      {selectedNote && (
        <div className="note-popup-overlay" onClick={closePopup}>
          <div
            className="note-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="note-popup-close"
              onClick={closePopup}
              aria-label="Close popup"
            >
              ×
            </button>

            <div className="note-popup-emoji">💌</div>

            <h3 id="note-popup-title">
              {selectedNote.mode === "view"
                ? "A Little Note"
                : "How Was Your Day?"}
            </h3>

            <p className="note-popup-date">{selectedNote.date}</p>

            {selectedNote.mode === "view" ? (
              <div className="note-popup-text">{selectedNote.text}</div>
            ) : (
              <textarea
                className="note-popup-input"
                value={noteInput}
                onChange={(event) => setNoteInput(event.target.value)}
                placeholder="Write down your feelings..."
                rows={5}
                autoFocus
              />
            )}

            <div className="note-popup-actions">
              {selectedNote.mode === "view" ? (
                <>
                  <button
                    type="button"
                    className="note-popup-button secondary"
                    onClick={() => {
                      setSelectedNote({
                        ...selectedNote,
                        mode: "edit",
                      });
                    }}
                  >
                    Edit Note
                  </button>

                  <button
                    type="button"
                    className="note-popup-button"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="note-popup-button secondary"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="note-popup-button"
                    onClick={handleSaveNote}
                  >
                    Save Note ♡
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MoodCalendar;
