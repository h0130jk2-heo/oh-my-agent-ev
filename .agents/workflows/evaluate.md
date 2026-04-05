---
description: "Generator-Evaluator loop. frontend-engineer implements, evaluator scores via live browser interaction, feedback flows back to Generator. Up to 15 iterations."
---

# MANDATORY RULES — VIOLATION IS FORBIDDEN

- **Response language follows `language` setting in `.agents/config/user-preferences.yaml` if configured.**
- **NEVER skip steps.** Execute from Step 0 in order.
- **Read required documents BEFORE starting.**

---

## Step 0: Preparation (DO NOT SKIP)

1. Read `.agents/skills/oma-evaluator/SKILL.md` — evaluation protocol.
2. Read `.agents/skills/oma-evaluator/resources/scoring-rubric.md` — scoring criteria.
3. Read `.agents/skills/oma-evaluator/resources/calibration-examples.md` — scoring anchors.
4. Read `.agents/skills/oma-evaluator/resources/sprint-contract-template.md` — contract format.
5. Read `.agents/skills/_shared/core/context-loading.md` — resource loading strategy.

---

## Step 1: Establish Sprint Contract

1. Check `.agents/plan.json` — find tasks with `acceptance_criteria`.
2. Auto-generate Sprint Contract:
   - `acceptance_criteria` → Functional requirements
   - `agent: "frontend"` → Add Design Quality + Originality requirements
   - Project `CLAUDE.md` → Inject technical constraints
3. Present Sprint Contract to the user for confirmation.
4. Save confirmed Contract to `.agents/results/sprint-contract-active.md`.

**If no Sprint Contract exists:**
- Ask the user for functional requirements + design direction.
- Generate Contract from user's answer.
- Must get user confirmation before proceeding.

---

## Step 2: Generator-Evaluator Loop

```
iteration = 0
max_iterations = 15
score_history = []       // [{iteration, weighted, dq, or, cr, fn, verdict}]
best_iteration = null    // track the highest-scoring iteration

WHILE iteration < max_iterations:
    iteration += 1

    // --- Generator Phase ---
    Spawn frontend-engineer (Generator):
      - Pass Sprint Contract
      - If iteration > 1: pass previous Evaluator critique + trend signal
      - Generator decides refine or pivot based on trend signal

    // --- Docker Rebuild (if containerized) ---
    IF frontend runs in Docker:
        Run: docker compose build frontend && docker compose up -d frontend
        Wait for container to be healthy before Evaluator starts
        Hard-reload browser after container restart

    // --- Evaluator Phase ---
    Spawn evaluator (Evaluator):
      - Pass Sprint Contract
      - Pass live page URL
      - Pass score_history (for trend calculation)
      - Browser: Use Playwright MCP primarily (text/DOM-first, ~4× cheaper than screenshot). If unavailable/fails, fallback to Claude in Chrome. See SKILL.md Phase 2 Verification Tier for tool selection rules.

    // --- Collect & Preserve Results ---
    Read evaluator result from .agents/results/result-evaluator.md
    Copy result to .agents/results/evaluate-iterations/iteration-{n}.md
    Save git snapshot: git stash push -m "eval-iteration-{n}" OR git tag eval-iter-{n}
    score_history.append({iteration, weighted, dq, or, cr, fn, verdict})

    // --- Track best iteration ---
    IF current_weighted > best_iteration.weighted:
        best_iteration = {iteration, weighted, snapshot_ref}

    IF verdict == "PASS":
        BREAK → Step 3
    ELSE:
        // Calculate trend signal
        IF len(score_history) >= 2:
            delta = score_history[-1].weighted - score_history[-2].weighted
            IF delta > 0 for last 2 iterations:
                signal = "TRENDING_WELL"     // → Generator: refine
            ELIF delta <= 0 for last 2 iterations OR current_weighted < 5.0:
                signal = "NOT_WORKING"       // → Generator: pivot
            ELSE:
                signal = "MIXED"             // → Generator: free judgment
        ELSE:
            signal = "FIRST_ITERATION"

        CONTINUE loop with signal
```

**Best iteration tracking**: Scores do not always improve linearly. A middle iteration may outperform the last. Every iteration result and code snapshot is preserved. The final report highlights the best-scoring iteration so the user can choose to roll back.

### Feedback Format for Generator

```markdown
## Evaluator Feedback — Iteration {n}

### Scores
- Design Quality: {score}/10 {BELOW_THRESHOLD if < 5.0}
- Originality: {score}/10 {BELOW_THRESHOLD if < 5.0}
- Craft: {score}/10 {BELOW_THRESHOLD if < 4.0}
- Functionality: {score}/10 {BELOW_THRESHOLD if < 4.0}
- Weighted: {weighted}/10

### Threshold Violations
{List any dimensions that fell below their hard threshold — these MUST be addressed}

### Trend
- Signal: {TRENDING_WELL | NOT_WORKING | MIXED | FIRST_ITERATION}
- Score History: [{history}]

### Critique Summary
{Evaluator's detailed critique summary}

### Your Decision (Generator)
Based on the trend signal:
- TRENDING_WELL → Keep current direction, address specific critique points only
- NOT_WORKING → Pivot to an entirely different aesthetic direction (radical change)
- MIXED → Use your judgment
```

---

## Step 3: Final Report

After loop completion (PASS or max_iterations reached):

```markdown
## Evaluate Session Report

### Result: {PASS | MAX_ITERATIONS_REACHED}
### Total Iterations: {n}
### Final Scores
| Dimension | Final | First | Delta |
|-----------|-------|-------|-------|
| Design Quality | _ | _ | +_ |
| Originality | _ | _ | +_ |
| Craft | _ | _ | +_ |
| Functionality | _ | _ | +_ |
| Weighted | _ | _ | +_ |

### Score Progression
| Iteration | Weighted | DQ | OR | CR | FN | Signal | Decision |
|-----------|----------|----|----|----|----|--------|----------|
| 1 | _ | _ | _ | _ | _ | FIRST | — |
| 2 | _ | _ | _ | _ | _ | _ | refine/pivot |
| ... | | | | | | | |

### Best Iteration
- **Iteration {n}** scored highest (weighted: {score})
- Snapshot ref: {git tag or stash ref}
- If the final iteration is not the best, consider rolling back to this snapshot

### Key Pivots
{Iterations where pivot occurred and direction change description}

### Lessons Learned
{Insights from the iteration process — which directions worked}
```

Save result to `.agents/results/evaluate-session-report.md`.

---

## Step 3.1: User Review of Evaluator Judgment (Tuning Loop)

After presenting the final report, ask the user:

> "Review the Evaluator's scores and critiques. Were there cases where the Evaluator's judgment diverged from yours? (e.g., scored too high/low, missed an issue, flagged a non-issue)"

If the user identifies divergences:
1. Document the specific divergence (what the Evaluator scored vs what the user believes is correct).
2. Update `resources/calibration-examples.md` with a new example capturing this correction.
3. This calibration prevents the same misjudgment in future sessions.

If the user approves all scores, proceed to Step 4.

---

## Step 4: Cleanup

1. Preserve intermediate iteration results (`.agents/results/evaluate-iterations/`).
2. Archive Sprint Contract.
3. Present final report to user.

---

## Constraints

| Constraint | Value | Reason |
|-----------|-------|--------|
| Max iterations | 15 | Prevent infinite loops |
| PASS threshold (weighted) | >= 8.0 | Museum-grade quality bar |
| PASS threshold (Originality) | >= 7.0 | AI Slop prevention |
| Exploration Loop trigger | 3 consecutive NOT_WORKING | Switch to hypothesis branching |
| Intermediate results | Always preserved | Track which directions were effective |
| Expected wall-clock time | 1-4 hours (full loop) | Each iteration involves Generator build + Evaluator live testing. Budget accordingly |
| One-shot evaluation time | 10-20 minutes | `/evaluate {url}` without loop |
