import { useEffect, useRef, useState } from "react";
import "../../styles/chatbot.css";

// ========================================
// DATE
// ========================================

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ========================================
// USER ID
// ========================================

const getUserId = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("moodGardenCurrentUser") || "null",
    );

    return user?.id || user?.email || "guest";
  } catch {
    return "guest";
  }
};

// ========================================
// CHAT STORAGE
// ========================================

const getStorageKey = (userId) => {
  return `moodChat_${userId}_all`;
};

const initialMessage = {
  role: "bot",
  text: "Hi! 💗 I'm here to listen. How are you feeling today?",
};

// ========================================
// LOAD AND MIGRATE OLD CHAT HISTORY
// ========================================

const loadChatHistory = (userId) => {
  const newKey = getStorageKey(userId);

  try {
    const existingChat = localStorage.getItem(newKey);

    // Load existing continuous conversation
    if (existingChat) {
      const parsed = JSON.parse(existingChat);

      return Array.isArray(parsed) && parsed.length ? parsed : [initialMessage];
    }

    // Find previous date-based conversations
    const oldPrefix = `moodChat_${userId}_`;
    const oldChats = [];

    Object.keys(localStorage)
      .filter(
        (key) =>
          key.startsWith(oldPrefix) &&
          key !== newKey &&
          /^\d{4}-\d{2}-\d{2}$/.test(key.slice(oldPrefix.length)),
      )
      .sort()
      .forEach((key) => {
        try {
          const parsed = JSON.parse(localStorage.getItem(key));

          if (Array.isArray(parsed)) {
            oldChats.push(...parsed);
          }
        } catch {
          console.error("Could not migrate:", key);
        }
      });

    // Remove repeated welcome messages
    const migratedMessages = oldChats.filter(
      (message) =>
        message.role === "user" ||
        (message.role === "bot" && message.text !== initialMessage.text),
    );

    const conversation = [initialMessage, ...migratedMessages];

    localStorage.setItem(newKey, JSON.stringify(conversation));

    return conversation;
  } catch (error) {
    console.error("Could not load chat history:", error);
    return [initialMessage];
  }
};

// ========================================
// GET MOOD HISTORY AND DAILY NOTES
// ========================================

const getMoodContext = () => {
  try {
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");

    const calendarNotes = JSON.parse(
      localStorage.getItem("calendarNotes") || "{}",
    );

    return {
      moodHistory: moodEntries
        .filter(
          (entry) =>
            entry &&
            typeof entry.date === "string" &&
            typeof entry.mood === "string",
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((entry) => ({
          date: entry.date,
          mood: entry.mood,
        })),

      dailyNotes: calendarNotes,
    };
  } catch (error) {
    console.error("Could not load mood context:", error);

    return {
      moodHistory: [],
      dailyNotes: {},
    };
  }
};

// ========================================
// CHATBOT COMPONENT
// ========================================

const MoodChatbot = ({ selectedDate, currentMood, calendarNote }) => {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedKey, setLoadedKey] = useState(null);
  const [showClearPopup, setShowClearPopup] = useState(false);

  const chatEndRef = useRef(null);

  const userId = getUserId();
  const activeDate = selectedDate || getToday();
  const storageKey = getStorageKey(userId);

  // ========================================
  // LOAD CONTINUOUS CONVERSATION
  // ========================================

  useEffect(() => {
    const savedMessages = loadChatHistory(userId);

    setMessages(savedMessages);
    setLoadedKey(storageKey);
  }, [storageKey, userId]);

  // ========================================
  // SAVE CONVERSATION AUTOMATICALLY
  // ========================================

  useEffect(() => {
    if (loadedKey !== storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Could not save chat history:", error);
    }
  }, [messages, storageKey, loadedKey]);

  // ========================================
  // AUTO SCROLL
  // ========================================

  useEffect(() => {
    const container = chatEndRef.current?.parentElement;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // ========================================
  // SEND MESSAGE TO OPENROUTER
  // ========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || isLoading || loadedKey !== storageKey) {
      return;
    }

    const userMessage = {
      role: "user",
      text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Keep the most recent conversation context
      const conversationHistory = updatedMessages
        .filter((message) => message.role === "user" || message.role === "bot")
        .slice(-12)
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.text,
        }));

      // Load complete emotional history
      const moodContext = getMoodContext();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,

          // Current calendar context
          currentMood,
          selectedDate: activeDate,
          calendarNote,

          // Complete emotional history
          moodHistory: moodContext.moodHistory,
          dailyNotes: moodContext.dailyNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get an AI response.");
      }

      if (!data.reply) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: `Debug error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // DATE AND TIME
  // ========================================

  const formattedDate = new Date(`${activeDate}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  const formattedTime = new Date().toLocaleTimeString();

  // ========================================
  // CLEAR CHAT
  // ========================================

  const handleClearChat = () => {
    const newMessages = [initialMessage];

    localStorage.setItem(storageKey, JSON.stringify(newMessages));

    setMessages(newMessages);
    setShowClearPopup(false);
  };

  // ========================================
  // UI
  // ========================================

  return (
    <section className="mood-chatbot">
      <div className="chatbot-current-mood">
        <div className="chatbot-header">
          <p className="chatbot-date">{formattedDate}</p>
          <p className="chatbot-time">{formattedTime}</p>
        </div>

        <p className="current-mood-label">Current Mood</p>

        <span className="current-mood-value">
          {currentMood || "Not recorded"}
        </span>
      </div>

      <div className="chatbot-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatbot-message-row ${
              message.role === "user" ? "user-message-row" : "bot-message-row"
            }`}
          >
            <p
              className={`chatbot-message ${
                message.role === "user" ? "user-message" : "bot-message"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="chatbot-message-row bot-message-row">
            <p className="chatbot-message bot-message chatbot-typing">
              Thinking... 💗
            </p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chatbot-form">
        <button
          type="button"
          onClick={() => setShowClearPopup(true)}
          disabled={isLoading}
          className="clear-chat-btn"
        >
          🗑
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          aria-label="Chat message"
          className="chatbot-input"
          disabled={isLoading || loadedKey !== storageKey}
        />

        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={isLoading || !input.trim() || loadedKey !== storageKey}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>

      <div className="chatbot-footer">
        <h3>Feel Better? ♡</h3>

        <p>
          Remember, every feeling is valid. You can take things one step at a
          time.
        </p>

        {showClearPopup && (
          <div
            className="clear-popup-overlay"
            onClick={() => setShowClearPopup(false)}
          >
            <div
              className="clear-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-popup-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="clear-popup-icon">🗑️</div>

              <h3 id="clear-popup-title">Clear Conversation?</h3>

              <p>
                Are you sure you want to clear this conversation? Your chat
                history cannot be recovered.
              </p>

              <div className="clear-popup-actions">
                <button
                  type="button"
                  className="clear-popup-cancel"
                  onClick={() => setShowClearPopup(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="clear-popup-confirm"
                  onClick={handleClearChat}
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoodChatbot;
