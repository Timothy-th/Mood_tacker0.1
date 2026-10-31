export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { messages, currentMood, selectedDate, calendarNote } =
      req.body || {};

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

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    const missing = [];

    if (!apiKey) missing.push("OPENROUTER_API_KEY");
    if (!model) missing.push("OPENROUTER_MODEL");

    if (missing.length > 0) {
      return res.status(500).json({
        error: `Missing environment variables: ${missing.join(", ")}`,
      });
    }

    const systemMessage = {
      role: "system",
      content: `
You are a friendly and supportive mood tracker companion.

Selected date: ${selectedDate || "Today"}
Selected emotion: ${currentMood || "Not recorded"}

Calendar reflection:
${
  typeof calendarNote === "string"
    ? calendarNote.slice(0, 3000) || "No note written."
    : "No note written."
}

PERSONALITY:
- Warm, gentle, caring, and non-judgmental.
- Listen carefully to the user's feelings.
- Respond naturally and conversationally.
- Keep replies concise but meaningful.
- Use occasional gentle emojis like 💗, 🌷, and 🌿.

BOUNDARIES:
- Never diagnose mental or physical health conditions.
- Never pretend to be a licensed therapist.
- Never judge or dismiss feelings.
- Encourage professional support when appropriate.
- If someone expresses immediate danger or self-harm thoughts,
  respond compassionately and encourage emergency support
  or contacting a trusted person.
`,
    };

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "Mood Tracker",
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...conversation],
          temperature: 0.7,
          max_tokens: 300,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Unable to connect to the AI service.",
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      return res.status(502).json({
        error: "The AI returned an empty response.",
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: error.message || "Something went wrong.",
    });
  }
}
