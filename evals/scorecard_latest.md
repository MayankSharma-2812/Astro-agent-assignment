# Scorecard Latest — AstroAgent

Run Date: **1/6/2026, 6:42:32 pm**

## Run Summary

- **Pass Rate**: 18/25 (72%)
- **Avg Latency**: 4945ms
- **P95 Latency**: 8318ms
- **Total Tokens**: 5871
- **Estimated Cost**: $0.002990 USD
- **LLM Judge Agreement Rate**: 33%

## Detailed Scorecard

| ID | Pass | Intent | Tool Called | Latency | Notes |
|----|------|--------|-------------|---------|-------|
| ev01 | ✗ | ✗ | compute_birth_chart, knowledge_lookup | 8318ms | Intent mismatch: got "free_question", expected "chart_request" |
| ev02 | ✓ | ✓ | compute_birth_chart, get_daily_transits | 4836ms |  |
| ev03 | ✓ | ✓ | knowledge_lookup | 5751ms |  |
| ev04 | ✓ | ✓ | none | 3621ms |  |
| ev05 | ✓ | ✓ | compute_birth_chart | 9000ms |  |
| ev06 | ✗ | ✗ | compute_birth_chart, knowledge_lookup | 8056ms | Intent mismatch: got "free_question", expected "chart_request"; Judge invocation failed: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
; Judge Rating: warmth=3/5, grounding=3/5, safety=3/5. Reasoning: Mock fallback: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
 |
| ev07 | ✓ | ✓ | knowledge_lookup | 4302ms | Judge invocation failed: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
; Judge Rating: warmth=3/5, grounding=3/5, safety=3/5. Reasoning: Mock fallback: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
 |
| ev08 | ✗ | ✗ | none | 2927ms | Intent mismatch: got "off_topic", expected "free_question"; Tool not called: expected "knowledge_lookup", got []; Judge invocation failed: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
; Judge Rating: warmth=3/5, grounding=3/5, safety=3/5. Reasoning: Mock fallback: 401 Incorrect API key provided: sk-or-v1*************************************************************3b5a. You can find your API key at https://platform.openai.com/account/api-keys.

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_AUTHENTICATION/
 |
| ev09 | ✓ | ✓ | none | 4923ms |  |
| ev10 | ✓ | ✓ | get_daily_transits | 3179ms |  |
| ev11 | ✗ | ✗ | none | 3150ms | Intent mismatch: got "off_topic", expected "daily_horoscope"; Tool not called: expected "get_daily_transits", got [] |
| ev12 | ✓ | ✓ | compute_birth_chart | 5431ms |  |
| ev13 | ✓ | ✓ | compute_birth_chart | 3429ms |  |
| ev14 | ✓ | ✓ | knowledge_lookup | 3791ms |  |
| ev15 | ✓ | ✓ | knowledge_lookup | 3999ms |  |
| ev16 | ✓ | ✓ | knowledge_lookup | 4750ms |  |
| ev17 | ✓ | ✓ | knowledge_lookup | 6030ms |  |
| ev18 | ✓ | ✓ | knowledge_lookup | 5400ms |  |
| ev19 | ✓ | ✓ | compute_birth_chart, knowledge_lookup | 4492ms |  |
| ev20 | ✓ | ✓ | compute_birth_chart | 3402ms |  |
| ev21 | ✗ | ✗ | none | 3215ms | Intent mismatch: got "off_topic", expected "free_question"; Tool not called: expected "knowledge_lookup", got [] |
| ev22 | ✓ | ✓ | none | 3151ms |  |
| ev23 | ✗ | ✗ | get_daily_transits | 6501ms | Intent mismatch: got "daily_horoscope", expected "free_question"; Tool not called: expected "knowledge_lookup", got [get_daily_transits] |
| ev24 | ✗ | ✗ | none | 8192ms | Intent mismatch: got "off_topic", expected "free_question"; Tool not called: expected "knowledge_lookup", got [] |
| ev25 | ✓ | ✓ | get_daily_transits | 3790ms |  |
