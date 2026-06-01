# AstroAgent 🌌

AstroAgent is an LLM-powered astrological assistant (named Ara) built as a daily spiritual companion. It classifies user intents, calculates simplified birth charts using astronomical calculations (`astronomia`), supports daily transit checks, and answers general astrology questions through a local knowledge lookup.

---

## LangGraph Workflow Diagram

```
  [START]
     │
     ▼
  [router] — classifies intent
     │
     ▼
  [shouldCallTools?]
  /              \
 /                \
▼                  ▼
[tools]       [respond] ◄── off_topic shortcut
 \                /
  \              /
   ▼            ▼
     [respond]
         │
         ▼
       [END]
```

---

## Architecture Overview

AstroAgent is architected around **LangGraph** on the backend and **React (Vite)** on the frontend. The backend utilizes a state graph consisting of three primary nodes: a `router` node that classifies user input, a `tools` node that executes computations (like natal chart ephemeris math), and a `respond` node that generates final LLM responses. Instead of a linear flow, it employs conditional routing (`shouldCallTools`) to bypass tools entirely if the request is classified as off-topic, routing it straight to the responder for redirection.

The Express server bridges the LangGraph agent and the client via **Server-Sent Events (SSE)**. It supports an in-memory session cache that maintains user message history and birth chart details across turns. During execution, it streams token blocks back to the frontend, simulating real-time text generation.

The frontend is a lightweight React client designed with a spiritual-midnight theme. It includes a birth form to capture date, time, name, and place, plus a scrolling chat window that interprets streaming server events. Development is simplified via a Vite proxy that routes backend API calls natively without hardcoded URLs.

---

## Installation & Setup

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your API key:
   ```env
   OPENAI_API_KEY=sk-proj-YOUR_OPENAI_OR_OPENROUTER_KEY
   PORT=3001
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### 3. Run Evaluations
To run the automated scorecard evaluation suite from the backend directory:
```bash
npm run eval
```

---

## Known Limitations

- **Simplified Planetary Math**: Mercury, Venus, and Mars positions are approximated using simple angular offsets from the Sun, rather than full multi-body heliocentric calculations.
- **In-Memory Sessions**: Conversation sessions and birth details are stored in-memory in the Express layer, meaning they will be lost when the server restarts.
- **Simulated SSE Streaming**: Because LangGraph fully buffers before returning, streaming is simulated token-by-token at the Express API layer using small word delays.
- **Evaluation Coverage**: The golden set contains 25 test cases for rapid evaluation; a full production rollout would benefit from 100+ cases.
