---
name: Enrollment footer behavior
description: Intent behind scroll-revealed order summaries on review and Customize.
---

Selection confirmation and Customize should have matching scroll-revealed footers, not order summaries that are immediately visible on entry.

**Why:** The user explicitly asked to bring Customize's existing hidden-until-scroll behavior to the preceding confirmation page.

**How to apply:** Preserve scroll-down reveal and scroll-up dismissal across both steps. This is independent of the bundle cards, which must remain visible. Keep Continue reachable when a screen is tall enough that the entire page fits without scrolling, and retain Customize's deliberate total feedback after selecting a bundle.

Keep the established footer slide animation; do not replace it with an opacity fade or redesign its timing when sharing visibility behavior.

**Why:** The user explicitly objected to the unrequested animation change and reported that upward scrolling no longer dismissed the footer as expected.

**How to apply:** Treat motion and visibility as separate concerns. An intentional upward scroll must dismiss the footer even during temporary bundle-total feedback or immediately after reaching the page bottom.
