---
name: Bundle comparison visibility
description: User intent for visible bundle choices versus optional feature comparison.
---

Upgrade bundle cards must remain visible by default. The feature-by-feature comparison and the informational Essentials baseline header belong together in the collapsed section behind the “Compare Bundles” text link. The baseline header is not a selection control and has no selected indicator.

**Why:** The user corrected an implementation that hid both cards and table, then explicitly requested making the baseline row a non-interactive header.

**How to apply:** Keep bundle selection separate from comparison visibility. “Change plan” should direct users to the visible cards, not require opening the feature matrix.

Offer a quiet “Return to Essentials · $99/mo” action beside the bundle heading when an upgrade is selected. Hide that area entirely when Essentials is selected; do not show an “Essentials selected” status.

**Why:** The user approved a return action without a fifth card, then explicitly requested hiding the redundant selected status for Essentials.

**How to apply:** Switching back must preserve the location and business phone selection. Derive the displayed price from the Essentials plan rather than hardcoding it.
