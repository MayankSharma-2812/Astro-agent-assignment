import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const apiKey = process.env.OPENAI_API_KEY || "";
const isOpenRouter = apiKey.startsWith("sk-or-");

const llm = new ChatOpenAI({
  model: isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini",
  temperature: 0,
  configuration: isOpenRouter ? { baseURL: "https://openrouter.ai/api/v1" } : undefined,
});

const ROUTER_PROMPT = `You are a classifier. Given a user message, return exactly one of:
- chart_request (if the user wants to calculate/see their birth/natal chart, or states they just shared/provided their birth details)
- daily_horoscope (if the user is asking about today's transits, current planetary configuration, daily horoscopes, or today's energy)
- free_question (if the user is asking a general astrological question about planets, signs, houses, love, or career)
- off_topic (if the user is talking about non-astrological topics)

Reply with ONLY that word. Nothing else.`;

export async function classifyIntent(message) {
  const res = await llm.invoke([
    new SystemMessage(ROUTER_PROMPT),
    new HumanMessage(message),
  ]);
  const intent = res.content.trim().toLowerCase();
  const valid = ["chart_request", "daily_horoscope", "free_question", "off_topic"];
  return valid.includes(intent) ? intent : "free_question";
}
