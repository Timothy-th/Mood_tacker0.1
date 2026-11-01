import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/feeling.css";

const moods = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😢", name: "Sad" },
  { emoji: "😠", name: "Angry" },
  { emoji: "🧘", name: "Relaxed" },
  { emoji: "😕", name: "Confused" },
  { emoji: "😰", name: "Anxious" },
  { emoji: "😖", name: "Stressed" },
  { emoji: "😐", name: "Bored" },
  { emoji: "🥺", name: "Lonely" },
  { emoji: "😌", name: "Calm" },
  { emoji: "😓", name: "Guilty" },
  { emoji: "😨", name: "Fearful" },
];

const ChooseMood = ({ onSubmitMood }) => {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!selectedMood) {
      setMessage("Please choose your current emotion first 💗");
      return;
    }

    const moodEntry = {
      mood: selectedMood,
      date: new Date().toLocaleDateString("en-CA"),
      timestamp: new Date().toISOString(),
    };

    const savedMoods = JSON.parse(localStorage.getItem("moodEntries") || "[]");

    savedMoods.push(moodEntry);

    localStorage.setItem("moodEntries", JSON.stringify(savedMoods));

    // Notify components that mood entries have changed
    window.dispatchEvent(new Event("moodEntriesUpdated"));

    onSubmitMood?.(moodEntry);

    // Navigate to the Calendar page
    navigate("/cal");
  };
  return (
    <section className="feeling-card">
      <h2 className="feeling-title">Choose your current emotion.</h2>

      <div className="feeling-grid">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.name.toLowerCase();

          return (
            <button
              key={mood.name}
              type="button"
              onClick={() => {
                setSelectedMood(mood.name.toLowerCase());
                setMessage("");
              }}
              aria-pressed={isSelected}
              className={`feeling-option ${isSelected ? "selected" : ""}`}
            >
              <span className="feeling-emoji" aria-hidden="true">
                {mood.emoji}
              </span>

              <span className="feeling-name">{mood.name}</span>
            </button>
          );
        })}
      </div>

      {message && (
        <p className="feeling-message" role="status">
          {message}
        </p>
      )}

      <div className="feeling-submit-area">
        <button
          type="button"
          onClick={handleSubmit}
          className="feeling-submit-btn"
        >
          Submit Emotion
        </button>
      </div>
    </section>
  );
};

export default ChooseMood;
