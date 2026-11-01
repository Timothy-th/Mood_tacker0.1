import { useState } from "react";
import MoodCalendar from "../components/calendar/MoodCalendar";
import MoodChatbot from "../components/calendar/MoodChatbot";
import Footer from "../components/Footer";
import "../styles/cal_layout.css";
import "../styles/global.css";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const loadNotes = () => {
  try {
    return JSON.parse(localStorage.getItem("calendarNotes") || "{}");
  } catch {
    return {};
  }
};
const loadMoodEntries = () => {
  try {
    return JSON.parse(localStorage.getItem("moodEntries") || "[]");
  } catch {
    return [];
  }
};

const Calendar = () => {
  const [notes, setNotes] = useState(loadNotes);
  const [selectedDate, setSelectedDate] = useState(getLocalDate);
  const [moodEntries] = useState(loadMoodEntries);

  const handleNotesChange = (updatedNotes) => {
    setNotes(updatedNotes);
  };

  const currentMood =
    moodEntries
      .filter((entry) => entry.date === selectedDate)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0]?.mood || "";

  const calendarNote = notes[selectedDate] || "";

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#fff8f8] px-4 py-8 md:px-8">
      <h2 className="calendar-page-title">
        Let's figure out how you feel today.
      </h2>

      <div className="calendar-chat-layout font-secondary">
        <MoodCalendar
          notes={notes}
          onNotesChange={handleNotesChange}
          onDateSelect={setSelectedDate}
        />

        <MoodChatbot
          selectedDate={selectedDate}
          currentMood={currentMood}
          calendarNote={calendarNote}
        />
      </div>

      {/* Back to Top */}
      <div className="calendar-back-to-top">
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          <img
            src="/icons/wired-lineal-259-share-square-arrow-in-reveal.gif"
            alt="to top"
          />
        </button>
      </div>

      <Footer />
    </main>
  );
};

export default Calendar;
