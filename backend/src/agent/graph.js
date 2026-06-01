import { StateGraph, END, MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { classifyIntent } from "./router.js";
import {
  computeBirthChart,
  getDailyTransits,
  geocodePlace,
  knowledgeLookup,
} from "./tools.js";
import { mergeState } from "./state.js";

const apiKey = process.env.OPENAI_API_KEY || "";
const isOpenRouter = apiKey.startsWith("sk-or-");

const llm = new ChatOpenAI({
  model: isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini",
  temperature: 0.7,
  streaming: true,
  configuration: isOpenRouter ? { baseURL: "https://openrouter.ai/api/v1" } : undefined,
});

const SYSTEM_PROMPT = `You are Ara, a warm and thoughtful AI astrologer for Aradhana — a daily spiritual companion app.

Your job is to help people understand their birth chart and what the stars say about their life. 
Be conversational, warm, and grounded. Don't be overly dramatic.

IMPORTANT RULES:
- Never present readings as medical, legal, or financial certainty
- Always frame things as possibilities and reflections, not absolutes
- If someone asks about medical symptoms or financial decisions, gently redirect
- You are a guide for self-reflection, not a fortune-teller`;

// Node: classify the user's intent
async function routerNode(state) {
  const lastMsg = state.messages[state.messages.length - 1];
  const intent = await classifyIntent(lastMsg.content);
  return { intent };
}

// Node: call the right tool based on intent
async function toolNode(state) {
  const { intent, birthDetails } = state;
  let chartData = state.chartData;
  const toolOutputs = [];

  // Auto-calculate birth chart if details are provided and chart isn't computed yet
  if (birthDetails && !chartData) {
    const chartOutput = await computeBirthChart(
      birthDetails.date,
      birthDetails.time,
      birthDetails.place
    );
    chartData = chartOutput;
    toolOutputs.push({ tool: "compute_birth_chart", result: chartOutput });
  }

  if (intent === "chart_request") {
    // Re-run computation if explicitly requested and not already calculated in this step
    if (birthDetails && !toolOutputs.some(t => t.tool === "compute_birth_chart")) {
      const chartOutput = await computeBirthChart(
        birthDetails.date,
        birthDetails.time,
        birthDetails.place
      );
      chartData = chartOutput;
      toolOutputs.push({ tool: "compute_birth_chart", result: chartOutput });
    }
  } else if (intent === "daily_horoscope") {
    const transitOutput = await getDailyTransits(chartData);
    toolOutputs.push({ tool: "get_daily_transits", result: transitOutput });
  } else if (intent === "free_question") {
    const lastMsg = state.messages[state.messages.length - 1];
    const lookupOutput = knowledgeLookup(lastMsg ? lastMsg.content : "");
    toolOutputs.push({ tool: "knowledge_lookup", result: lookupOutput });
  }

  return { chartData, toolOutputs };
}

// Node: generate the final conversational response
async function respondNode(state) {
  const { messages, chartData, toolOutputs, intent, birthDetails } = state;

  let context = "";
  if (chartData && !chartData.error) {
    context += `\nUser's natal chart: ${JSON.stringify(chartData.planets)}. Ascendant info from birth at ${chartData.birthDetails?.place}.`;
  }
  if (toolOutputs.length > 0) {
    const last = toolOutputs[toolOutputs.length - 1];
    context += `\nTool used: ${last.tool}. Result: ${JSON.stringify(last.result)}`;
  }
  if (intent === "off_topic") {
    context += "\nThe user's message is off-topic. Gently redirect them back to astrology.";
  }

  const systemMsg = new SystemMessage(SYSTEM_PROMPT + (context ? `\n\nContext:${context}` : ""));
  const chatHistory = messages.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  const response = await llm.invoke([systemMsg, ...chatHistory]);
  return {
    messages: [{ role: "assistant", content: response.content }],
  };
}

// Decide whether to call tools or skip straight to respond
function shouldCallTools(state) {
  const { intent } = state;
  if (intent === "off_topic") return "respond";
  return "tools";
}

// Build the graph
export function buildGraph() {
  const graph = new StateGraph({
    channels: {
      messages: { reducer: (a, b) => [...a, ...b], default: () => [] },
      birthDetails: { reducer: (_, b) => b, default: () => null },
      chartData: { reducer: (_, b) => b, default: () => null },
      intent: { reducer: (_, b) => b, default: () => null },
      toolOutputs: { reducer: (a, b) => [...a, ...b], default: () => [] },
    },
  });

  graph.addNode("router", routerNode);
  graph.addNode("tools", toolNode);
  graph.addNode("respond", respondNode);

  graph.setEntryPoint("router");
  graph.addConditionalEdges("router", shouldCallTools, {
    tools: "tools",
    respond: "respond",
  });
  graph.addEdge("tools", "respond");
  graph.addEdge("respond", END);

  return graph.compile();
}
