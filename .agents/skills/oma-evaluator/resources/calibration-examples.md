# Calibration Examples

Use these examples to anchor scoring judgment before each evaluation.
Review this file at the start of every evaluation session to prevent score drift.

> Source: "I calibrated the evaluator using few-shot examples with detailed score breakdowns.
> This ensured the evaluator's judgment aligned with my preferences, and reduced score drift across iterations."

---

## Example 1: Classic AI Slop (NEEDS_WORK — Weighted: 4.2)

**Description**: A dashboard with purple gradient hero, white cards with identical rounded corners and drop shadows, generic "Welcome to Your Dashboard" heading, stock icons next to every label, all buttons are identical blue pills.

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Design Quality | 4 | Components exist but feel assembled from a template, not designed as a whole. No distinct mood or identity. |
| Originality | 2 | Every element is a recognizable AI default. Purple gradient + white cards is the hallmark of zero creative input. |
| Craft | 6 | Spacing is consistent, contrast is adequate, typography has basic hierarchy. Technically competent. |
| Functionality | 6 | Navigation is clear, buttons work, but CTAs are undifferentiated — user can't tell what's primary. |

**Key takeaway**: Craft and Functionality can score adequately even when Design Quality and Originality are poor. High Craft does NOT excuse low Originality.

---

## Example 2: Bold But Rough (NEEDS_WORK — Weighted: 6.5)

**Description**: A portfolio site with a striking split-screen layout, custom serif font pairing, asymmetric grid. But spacing is inconsistent between sections, one color is slightly off-palette, and the mobile layout breaks at 480px.

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Design Quality | 7 | Strong concept with a clear mood. The palette and typography choices create identity, despite a few dissonant notes. |
| Originality | 8 | Clear evidence of deliberate creative decisions. The asymmetric grid and font pairing show intentional departure from defaults. |
| Craft | 4 | Spacing inconsistencies are noticeable. The broken mobile layout is a fundamental craft failure. Color disharmony in one accent. |
| Functionality | 6 | Desktop navigation works well. Mobile breakage blocks core usability on small screens. |

**Key takeaway**: High Originality earns credit, but Craft failures must be named specifically. This is NEEDS_WORK because Craft < 5.0 (hard threshold: 4.0 pass, but weighted score 6.5 < 8.0).

---

## Example 3: Polished But Generic (NEEDS_WORK — Weighted: 6.8)

**Description**: A SaaS landing page with clean whitespace, professional typography, smooth scroll animations, consistent 8px grid. But it looks exactly like every other SaaS landing page — hero with headline + subheadline + CTA, three feature cards, testimonial carousel, pricing table.

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Design Quality | 7 | Cohesive and professional. All elements work together. But "together" means "like every other page." |
| Originality | 3 | Zero evidence of custom decisions. This is a template with content swapped in. A human designer would not recognize creative intent. |
| Craft | 9 | Excellent technical execution. Grid alignment, contrast, spacing all precise. |
| Functionality | 9 | Clear CTAs, logical flow, excellent mobile experience. |

**Key takeaway**: Perfect Craft + Functionality cannot compensate for low Originality. This fails the Originality >= 7.0 requirement despite high composite. The evaluator must resist being impressed by polish alone.

---

## Example 4: PASS-Worthy (PASS — Weighted: 8.3)

**Description**: A real estate analytics dashboard with a dark navy theme, data cards using subtle glassmorphism with project-specific amber accent, custom map marker visualization that feels native to the brand, typography mixing a display sans-serif for headlines with a monospace for data. Navigation uses a unique sidebar with animated iconography.

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Design Quality | 8 | Coherent dark theme with intentional accent color. Components feel designed for this specific product, not assembled. |
| Originality | 8 | Custom marker design, unique sidebar pattern, deliberate font pairing. Clear departure from standard dashboard templates. |
| Craft | 9 | Pixel-perfect alignment, consistent spacing tokens, proper contrast ratios even on dark backgrounds. |
| Functionality | 8 | Clear data hierarchy, primary actions obvious, map interaction intuitive. Minor: one tooltip clips at edge. |

**Key takeaway**: PASS requires both high composite AND evidence of intentional creative decisions. Technical excellence alone is insufficient.

---

## Scoring Anchors (Quick Reference)

| Score | Means |
|-------|-------|
| 9-10 | Exceptional — would impress a professional designer |
| 7-8 | Good — clear intent and competence, minor issues only |
| 5-6 | Mediocre — functional but unremarkable, or has notable flaws |
| 3-4 | Poor — generic, broken, or lacking intent |
| 1-2 | Bad — clearly wrong or AI Slop |
| 0 | Broken — non-functional |

---

## Anti-Leniency Anchors

When you catch yourself thinking any of these, STOP and hold the score:

- "It's not perfect, but it's good enough" → It is NOT good enough. Score what you see.
- "The overall feel is nice despite this issue" → Score the issue. Do not let mood override specifics.
- "This is a minor thing" → Specify WHY it's minor. If you can't articulate, it's not minor.
- "For AI-generated output, this is impressive" → The standard is human-designer quality, not AI-relative.
- "They tried hard on this" → Effort is not a scoring dimension. Score the output.
