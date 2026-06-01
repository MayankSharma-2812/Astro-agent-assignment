import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Dynamically import buildGraph to ensure dotenv.config() loads environment variables first
const { buildGraph } = await import("./agent/graph.js");

const app = express();
app.use(cors());
app.use(express.json());

const graph = buildGraph();

// in-memory session store — good enough for a take-home
const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      messages: [],
      birthDetails: null,
      chartData: null,
      toolOutputs: [],
      intent: null,
    });
  }
  return sessions.get(sessionId);
}

function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return false;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const monthLengths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeap) {
    monthLengths[2] = 29;
  }
  return day <= monthLengths[month];
}

// POST /chat — main chat endpoint with SSE streaming
app.post("/chat", async (req, res) => {
  const { message, sessionId, birthDetails } = req.body;

  // Trim message whitespace
  let sanitizedMessage = (message || "").trim();

  // If message is empty after trim, return 400
  if (!sanitizedMessage) {
    return res.status(400).json({ error: "message is required and cannot be empty" });
  }

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  // Cap message length at 2000 characters
  if (sanitizedMessage.length > 2000) {
    sanitizedMessage = sanitizedMessage.substring(0, 2000);
  }

  // Validate birthDetails.date if provided
  if (birthDetails && birthDetails.date) {
    if (!isValidDate(birthDetails.date)) {
      return res.status(400).json({ error: "birthDetails.date must be a valid calendar date" });
    }
    const [y, m, d] = birthDetails.date.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    if (dateObj > new Date()) {
      return res.status(400).json({ error: "birthDetails.date cannot be in the future" });
    }
  }

  // Set SSE headers for streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const session = getSession(sessionId);

  // If user submitted birth details, save to session
  if (birthDetails) {
    session.birthDetails = birthDetails;
  }

  // Add the new user message (sanitized)
  session.messages.push({ role: "user", content: sanitizedMessage });

  try {
    // Send a tool-activity event before running the graph
    res.write(`data: ${JSON.stringify({ type: "status", text: "Consulting the stars..." })}\n\n`);

    const result = await graph.invoke({
      messages: session.messages,
      birthDetails: session.birthDetails,
      chartData: session.chartData,
      toolOutputs: [],
      intent: null,
    });

    // Update session with results
    session.chartData = result.chartData || session.chartData;
    const toolsUsed = result.toolOutputs || [];

    // Stream tool activity info
    for (const t of toolsUsed) {
      res.write(`data: ${JSON.stringify({ type: "tool_call", tool: t.tool })}\n\n`);
    }

    // Get the assistant reply
    const assistantMessages = result.messages.filter((m) => m.role === "assistant");
    const reply = assistantMessages[assistantMessages.length - 1]?.content || "";

    // Save assistant reply to session
    session.messages.push({ role: "assistant", content: reply });

    // Stream the response token by token (simulate since LangGraph buffers)
    const words = reply.split(" ");
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ type: "token", text: word + " " })}\n\n`);
      await new Promise((r) => setTimeout(r, 20));
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Agent error:", err);
    res.write(`data: ${JSON.stringify({ type: "error", text: "Something went wrong. Please try again." })}\n\n`);
    res.end();
  }
});

// GET /history/:sessionId
app.get("/history/:sessionId", (req, res) => {
  const session = getSession(req.params.sessionId);
  res.json({ messages: session.messages, chartData: session.chartData });
});

// GET /health
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AstroAgent backend running on port ${PORT}`));
