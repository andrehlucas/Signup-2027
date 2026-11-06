---
name: Mobile browser form compatibility
description: Preserve native contact autofill, accessible zoom and stable iPhone form navigation.
---

Keep the viewport stable during field focus and blur; do not reintroduce a script that temporarily disables zoom to reset the page.

**Why:** A previous blur handler repeatedly rewrote the viewport and forced field blur on Enter. The user reported an unusable iPhone Safari form experience. Prevention through readable input sizing is preferable to moving the viewport after every interaction.

**How to apply:** Preserve pinch zoom, readable controls in portrait and landscape, and normal keyboard navigation. Keep footer animation and desktop layout independent of these platform fixes.

Test contact autofill separately from typing and pasting. Allow an international number even when the current country selector differs, without rejecting territories that share calling codes.

**Why:** The user reported a crash specifically when using Safari contact suggestions. Those replacements can bypass paste handlers and arrive without ordinary caret or character data. Browser-owned caret handling on touch devices prioritizes reliable autofill over smart cursor repositioning.

**How to apply:** Exercise whole-field replacement, international prefixes, missing caret data, draft recovery and invalid-number validation. Do not disable autocomplete as a workaround. Simulated input events are regression checks, not proof that the native Safari suggestion UI works on an actual iPhone.
