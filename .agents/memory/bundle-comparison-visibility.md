---
name: Bundle comparison visibility
description: User intent for visible bundle choices versus optional feature comparison.
---

Upgrade bundle cards must remain visible by default. The feature-by-feature comparison and the Essentials baseline selection row belong together in the collapsed section behind the “Compare Bundles” text link.

**Why:** The user corrected an implementation that hid both the cards and table; customers must still see and select upgrade bundles without expanding the comparison.

**How to apply:** Keep bundle selection separate from comparison visibility. “Change plan” should direct users to the visible cards, not require opening the feature matrix.

Offer a quiet “Return to Essentials · $99/mo” action beside the bundle heading when an upgrade is selected; show “Essentials selected” otherwise.

**Why:** The user approved this approach to make returning to the base plan discoverable without adding a fifth card or expanding the comparison.

**How to apply:** Switching back must preserve the location and business phone selection. Derive the displayed price from the Essentials plan rather than hardcoding it.
