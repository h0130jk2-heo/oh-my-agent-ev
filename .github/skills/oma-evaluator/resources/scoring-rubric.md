# Scoring Rubric — 4-Dimension Evaluation Criteria

## 1. Design Quality (Weight: 30%)

> Does the design feel like a coherent whole rather than a collection of parts? Strong work here means the colors, typography, layout, imagery, and other details combine to create a distinct mood and identity.

| Score | Criteria |
|-------|----------|
| 9-10 | All elements converge into a strong, unified identity. Portfolio-grade work |
| 7-8 | Consistent mood with most elements in harmony. Only minor inconsistencies |
| 5-6 | Partially cohesive, but some elements clash with the overall tone |
| 3-4 | No clear identity. Elements feel disconnected |
| 1-2 | Chaotic. Colors, typography, and layout contradict each other |
| 0 | Broken or no styles applied |

**Observation points:**
- Color palette consistency (primary, secondary, accent harmony)
- Typography system (heading/body/caption hierarchy)
- Layout rhythm (whitespace, grid, alignment)
- Visual weight distribution (existence of focal points)
- Dark/light mode consistency (if applicable)

---

## 2. Originality (Weight: 30%)

> Is there evidence of custom decisions, or is this template layouts, library defaults, and AI-generated patterns? A human designer should recognize deliberate creative choices. Unmodified stock components — or telltale signs of AI generation like purple gradients over white cards — fail here.

| Score | Criteria |
|-------|----------|
| 9-10 | Distinct visual language. Design choices unique to this project |
| 7-8 | Multiple custom decisions. Standard components intentionally modified |
| 5-6 | Some customization, but mostly default library/framework styling |
| 3-4 | Almost entirely defaults. Template with only colors changed |
| 1-2 | Classic AI Slop: purple gradients on white cards, excessive rounded corners, meaningless icons |
| 0 | Raw HTML or completely unstyled |

**AI Slop Checklist (any match = -2 points):**
- [ ] Purple/blue gradient background + white card layout
- [ ] Identical border-radius + shadow on every card
- [ ] Meaningless decorative icons scattered everywhere
- [ ] Generic "Welcome to..." hero section
- [ ] All buttons styled identically (no CTA differentiation)
- [ ] Excessive gradient text
- [ ] Unmodified Tailwind UI / shadcn template

---

## 3. Craft (Weight: 20%)

> Technical execution: typography hierarchy, spacing consistency, color harmony, contrast ratios. This is a competence check rather than a creativity check. Most reasonable implementations do fine here by default; failing means broken fundamentals.

| Score | Criteria |
|-------|----------|
| 9-10 | Pixel-perfect. Spacing, alignment, contrast all intentional and precise |
| 7-8 | Mostly accurate. Only minor alignment deviations |
| 5-6 | Generally adequate, but noticeable spacing inconsistencies or alignment errors |
| 3-4 | Multiple broken alignments, inconsistent spacing, unstable typography |
| 1-2 | Below baseline. Text readability and contrast issues |
| 0 | Layout itself is broken |

**Observation points:**
- WCAG 2.1 AA contrast compliance (4.5:1 body, 3:1 large text)
- 8px grid alignment adherence
- Consistent spacing token usage (no magic numbers)
- hover/focus/active state implementation
- Layout integrity across responsive breakpoints

---

## 4. Functionality (Weight: 20%)

> Usability independent of aesthetics. Can users understand what the interface does, find primary actions, and complete tasks without guessing?

| Score | Criteria |
|-------|----------|
| 9-10 | Intuitive. All core tasks completable without explanation. Clear error handling |
| 7-8 | Mostly intuitive. Only minor UX friction |
| 5-6 | Core tasks possible, but some paths cause confusion |
| 3-4 | Primary features hard to access or navigation unclear |
| 1-2 | Core tasks cannot be completed |
| 0 | App doesn't load or crashes |

**Live test scenarios (MANDATORY):**
- [ ] Main CTA identifiable within 3 seconds of landing
- [ ] Primary task flow completable end-to-end
- [ ] Error states provide clear user feedback
- [ ] Loading states are visible (skeleton/spinner)
- [ ] No critical errors in console
