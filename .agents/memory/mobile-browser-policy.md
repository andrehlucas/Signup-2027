---
name: Mobile browser form compatibility
description: Preserve native contact autofill, accessible zoom and stable iPhone form navigation.
---

Keep the viewport stable during field focus and blur; do not reintroduce a script that temporarily disables zoom to reset the page.

**Why:** A previous blur handler repeatedly rewrote the viewport and forced field blur on Enter. The user reported an unusable iPhone Safari form experience. Prevention through readable input sizing is preferable to moving the viewport after every interaction.

**How to apply:** Preserve pinch zoom, readable controls in portrait and landscape, and normal keyboard navigation. Keep footer animation and desktop layout independent of these platform fixes.

Test contact autofill separately from typing and pasting. Allow an international number even when the current country selector differs, without rejecting territories that share calling codes.

**Why:** The user repeatedly reported crashes when accepting browser contact suggestions. Those replacements can bypass paste handlers and arrive without ordinary caret or character data. Disabling smart cursor behavior only for touch devices left another autofill crash path: pointer capability does not identify whether a number was typed or supplied by the browser.

**How to apply:** Preserve native telephone semantics and autocomplete. Never require selection access for whole-field replacement on either desktop or mobile. Treat the normalized number and its country as one result: autofill can emit both input and change before React commits a country change. Exercise replacement events with missing caret/character data, repeated fills of the same number, international prefixes, draft recovery and invalid-number validation. Do not disable autocomplete as a workaround. Simulated input events are regression checks, not proof that the native Safari suggestion UI works on an actual iPhone.

For headless focus/blur checks, ensure the document really has focus, not merely that `activeElement` names the field.

**Why:** A background CDP page can update `activeElement` without delivering the real focus events needed by React's blur handler. This can produce a false failure when testing autofill reconciliation.

**How to apply:** Enable focus emulation for focus/blur journeys and distinguish a missing browser event from a broken form handler.
