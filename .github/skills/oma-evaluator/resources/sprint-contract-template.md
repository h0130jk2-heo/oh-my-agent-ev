# Sprint Contract Template

A Sprint Contract pre-defines "done" before the Generator-Evaluator loop begins.
Auto-generated from `plan.json` `acceptance_criteria`, or manually defined by the user.

## Depth Principle

> "Stay focused on product context and high-level technical design rather than detailed technical implementation."
> "If the planner tried to specify granular technical details upfront and got something wrong, the errors in the spec would cascade into the downstream implementation."

Sprint Contracts should be:
- **Ambitious about scope** — describe what the product should DO and FEEL like
- **Light on implementation** — do NOT specify component names, state management patterns, or file structures
- **Focused on outcomes** — "map interaction feels fluid" not "use requestAnimationFrame for pan"

The Generator decides HOW to implement. The Contract only defines WHAT "done" looks like.

---

## Sprint Contract Format

```markdown
## Sprint Contract: {feature_name}

### Goal
{One sentence describing what this sprint must achieve}

### Target URL
{Page URL to evaluate, e.g., http://localhost:3000}

### Functional Requirements (Functionality)
- [ ] {Core feature 1}
- [ ] {Core feature 2}
- [ ] {Core feature 3}

### Design Requirements (Design Quality + Originality)
- [ ] {Visual identity or mood keywords}
- [ ] {Patterns to explicitly avoid — specify AI Slop}
- [ ] {Reference designs or inspiration sources, if any}

### Technical Constraints (Craft) — keep high-level only
- [ ] {Responsive targets (e.g., mobile 360px+, tablet 768px+)}
- [ ] {Accessibility standard (e.g., WCAG 2.1 AA)}
- Do NOT specify: component names, state libraries, file paths, implementation patterns
- The Generator decides implementation details

### PASS Criteria
- Weighted score >= 8.0
- Originality >= 7.0
- All functional requirements met

### Max Iterations
{Default: 15}
```

---

## plan.json → Sprint Contract Conversion

When `plan.json` contains `acceptance_criteria` in this format:

```json
{
  "tasks": [
    {
      "id": "T1",
      "title": "Landing page redesign",
      "agent": "frontend",
      "acceptance_criteria": [
        "Hero section includes interactive data visualization",
        "Break away from purple gradient card pattern",
        "Map goes full-screen on mobile"
      ]
    }
  ]
}
```

Auto-conversion rules:
1. `acceptance_criteria` items → Functional requirements checklist
2. `agent: "frontend"` → Auto-add Design Quality + Originality requirements
3. Project `CLAUDE.md` conventions → Auto-inject into Technical Constraints

---

## Contract Negotiation (Optional)

In the article's approach, "the generator and evaluator negotiated a sprint contract: agreeing on what 'done' looked like for that chunk of work before any code was written."

If time permits, you can run a negotiation step:
1. Generator proposes what it can deliver and potential design directions
2. Evaluator reviews the proposal and adds specific quality criteria
3. Both agree on the final contract before implementation starts

This is optional — for most workflows, auto-generated + user-confirmed contracts are sufficient.
The negotiation step adds value when the scope is ambiguous or when design direction is completely open.
