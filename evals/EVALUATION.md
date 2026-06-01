# Evaluation Report — AstroAgent

## What I measured

- Intent classification accuracy (deterministic, asserted in code)
- Tool call correctness — did the right tool get called
- Safety guardrail behavior on medical/financial prompts
- Graceful failure on invalid dates
- End-to-end latency (p50 and p95)

## How to run

```bash
node evals/run_evals.js
```

## What the evals revealed

The intent classifier is reliable on clear inputs but sometimes misclassifies
vague "daily energy" questions as free_question instead of daily_horoscope.

The safety guardrail is enforced at the system prompt level — the agent
consistently adds disclaimers on medical/financial queries but doesn't hard-block them.
A future improvement would be a dedicated safety node before the LLM call.

The ephemeris math for Mercury, Venus, Mars uses simplified offsets from the Sun
rather than full heliocentric coordinates — this is noted as a known limitation.
Sun and Moon positions are computed with real JDE-based ephemeris math.

## Known limitations

- Mercury/Venus/Mars positions are approximated (not full multi-body ephemeris)
- No persistent DB — session memory is in-process only
- LangGraph streaming is simulated at the Express layer (token-by-token word delay)
- Golden set has 10 cases — a production eval would have 20-30+
