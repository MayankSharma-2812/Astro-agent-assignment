// This defines the shape of state flowing through our LangGraph agent
// Think of it like a shared memory object the whole graph reads and writes

export const defaultState = {
  messages: [],          // full conversation history
  birthDetails: null,    // { name, date, time, place }
  chartData: null,       // computed natal chart
  intent: null,          // classified intent of latest message
  toolOutputs: [],       // results from tool calls
};

export function mergeState(existing, update) {
  return {
    ...existing,
    ...update,
    messages: [...(existing.messages || []), ...(update.messages || [])],
    toolOutputs: [...(existing.toolOutputs || []), ...(update.toolOutputs || [])],
  };
}
