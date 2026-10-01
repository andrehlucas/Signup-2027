---
name: Signup navigation hierarchy
description: Preserve text-only Back actions when changing primary button colors.
---

Back must remain a text-only action, not a filled primary button, wherever it is present. The location step retains it; the program step's footer was explicitly removed.

**Why:** The user explicitly rejected converting Back to a filled button during the navigation color update and chose to restore its original style.

**How to apply:** Apply filled-button color changes without changing Back's hierarchy or reintroducing the removed program footer. Keep the same distinction in the app and its design preview.

The location step advances through a choose button in each card, not a separate footer Continue.

**Why:** The user explicitly requested the location-card button as the action that takes the user to the next step.

**How to apply:** Keep selection and advancing together in that action, preserve the text-only Back control, and do not restore the old separate Continue flow.