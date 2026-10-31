import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "20kb" }));

// ========================================
// CHAT API
// ========================================

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentMood, selectedDate, calendarNote } = req.body;
    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please provide chat messages.",
      });
    }

    if (messages.length > 12) {
      return res.status(400).json({
        error: "Too many messages.",
      });
    }

    const conversation = messages.map((message) => {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > 2000
      ) {
        throw new Error("Invalid message format.");
      }

      return {
        role: message.role,
        content: message.content.trim(),
      };
    });

    // ========================================
    // CHECK API CONFIGURATION
    // ========================================

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OpenRouter API key is missing.",
      });
    }

    if (!process.env.OPENROUTER_MODEL) {
      return res.status(500).json({
        error: "OpenRouter model is missing.",
      });
    }

    // ========================================
    // SYSTEM PROMPT
    // ========================================

    const systemMessage = {
      role: "system",
      content: `
You are a friendly and supportive mood tracker companion.

USER'S DAILY INFORMATION

Selected date: ${selectedDate || "Today"}
Selected emotion: ${currentMood || "Not recorded"}

Calendar reflection:
${typeof calendarNote === "string" ? calendarNote.slice(0, 3000) || "No note written for this date." : "No note written for this date."}

YOUR PERSONALITY
- Warm, gentle, caring, and non-judgmental.
- Listen carefully to the user's feelings.
- Respond naturally and conversationally.
- Keep replies concise but meaningful.
- Use occasional gentle emojis such as 💗, 🌷, and 🌿.

HOW TO USE DAILY INFORMATION
- Use the selected emotion and calendar reflection as context.
- Refer to specific experiences from the user's note when relevant.
- Help the user reflect on their feelings.
- Never assume that an emotion or experience from another date applies to this date.
- Never invent personal experiences or information.
- If no mood or note is recorded, don't pretend that one exists.

IMPORTANT BOUNDARIES
- Never diagnose mental or physical health conditions.
- Never pretend to be a licensed therapist.
- Never judge or dismiss the user's feelings.
- Encourage professional support when appropriate.
- If someone expresses immediate danger or thoughts of self-harm, respond compassionately and encourage them to contact emergency services or a trusted person.
`,
    };

    // ========================================
    // OPENROUTER REQUEST
    // ========================================

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Mood Tracker",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages: [systemMessage, ...conversation],
          temperature: 0.7,
          max_tokens: 300,
        }),
      },
    );

    const data = await response.json();

    // ========================================
    // HANDLE API ERRORS
    // ========================================

    if (!response.ok) {
      console.error("OpenRouter API error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Unable to connect to the AI service.",
      });
    }

    // ========================================
    // GET AI RESPONSE
    // ========================================

    const reply = data.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      return res.status(502).json({
        error: "The AI returned an empty response.",
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat server error:", error);

    return res.status(500).json({
      error: error.message || "Something went wrong.",
    });
  }
});

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.send("Mood Tracker AI Server is running! 💗");
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`Mood Tracker AI Server running on port ${PORT}`);
});
