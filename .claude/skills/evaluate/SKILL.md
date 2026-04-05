---
name: evaluate
description: "Run the Generator-Evaluator loop. Evaluates frontend implementation via live browser interaction and iterates toward museum-grade quality. Invoke with /evaluate."
user_invocable: true
---

# /evaluate — Frontend Design Evaluation Loop

Iteratively improve frontend design quality using the Generator-Evaluator pattern.

## Usage

```
/evaluate                          # Full loop with Sprint Contract
/evaluate {url}                    # One-shot evaluation of a specific URL (no loop)
/evaluate --iterations 5           # Set max iteration count
```

## How It Works

1. Auto-generate Sprint Contract from `.agents/plan.json`
2. Generator (frontend-engineer) implements
3. Evaluator navigates live page via browser tools, screenshots, scores
4. Feedback flows back to Generator → Generator decides refine or pivot
5. Repeats until PASS (weighted >= 8.0 + Originality >= 7.0) or max iterations

## Workflow

When this skill is invoked, execute the full protocol from `.agents/workflows/evaluate.md`.

1. Read `.agents/workflows/evaluate.md` — load the full workflow.
2. Execute from Step 0 in order.
3. Write intermediate results to `.agents/results/`.
4. Present final report to the user.
