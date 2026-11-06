---
name: Enrollment footer behavior
description: Intent behind scroll-revealed order summaries on review and Customize.
---

Selection confirmation and Customize should have matching scroll-revealed footers, not order summaries that are immediately visible on entry.

**Why:** The user explicitly asked to bring Customize's existing hidden-until-scroll behavior to the preceding confirmation page.

**How to apply:** Preserve scroll-down reveal and scroll-up dismissal across both steps. This is independent of the bundle cards, which must remain visible. Keep Continue reachable when a screen is tall enough that the entire page fits without scrolling, and retain Customize's deliberate total feedback after selecting a bundle.
