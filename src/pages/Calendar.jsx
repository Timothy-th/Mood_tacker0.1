import { useState } from "react";
import MoodCalendar from "../components/calendar/MoodCalendar";
import MoodChatbot from "../components/calendar/MoodChatbot";
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

  return (
    <main className="min-h-screen bg-[#fff8f8] px-4 py-8 md:px-8">
      <h2 className="calendar-page-title">
        Let's figure out how you feel today.
      </h2>

      <div className="calendar-chat-layout font-secondary">
        {" "}
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

      <section className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 text-center md:grid-cols-3">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <img
            src="/image/wired-lineal-2742-logo-square-signal-hover-pinch.gif"
            alt="Community"
            className="mx-auto mb-3 h-12 w-12 object-contain"
          />
          <h3 className="mb-2 font-semibold calendar-feature-title font-main">
            Contact & Community
          </h3>

          <p className="calendar-feature-text">
            Want to talk to someone? Visit our Contact page to share your
            thoughts and find support.
          </p>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <img
            src="/image/wired-lineal-471-ebook-reader-hover-pinch.gif"
            alt="Resources"
            className="mx-auto mb-3 h-12 w-12 object-contain"
          />
          <h3 className="mb-2 font-semibold calendar-feature-title font-main">
            Mental Health Resources
          </h3>
          <p className="text-sm text-gray-600">
            Explore helpful resources and reach out to a trusted person or
            professional when you need support.
          </p>
          <a
            href="https://www.samhsa.gov/mental-health"
            target="_blank"
            rel="noreferrer"
            className="calendar-support-link"
          >
            Support resources
          </a>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <img
            src="/image/wired-lineal-2815-ghost-hover-pinch (1).gif"
            alt="Privacy"
            className="mx-auto mb-3 h-12 w-12 object-contain"
          />
          <h3 className="mb-2 font-semibold calendar-feature-title font-main">
            Privacy & Safety
          </h3>
          <p className="text-sm text-gray-600">
            Your mood notes are stored locally in this browser. Remember to
            celebrate your progress, even in small steps.
          </p>
        </article>
      </section>
      <footer className="calendar-footer">
        <p>Take care of your feelings—one mood at a time.</p>
        <p>© 2026 Mood Tracker Project</p>

        <a
          href="#to-top"
          className="calendar-back-to-top"
          aria-label="Back to top"
        >
          <img
            src="/image/wired-lineal-259-share-arrow-hover-pointing.gif"
            alt=""
          />
        </a>
      </footer>
    </main>
  );
};

export default Calendar;
