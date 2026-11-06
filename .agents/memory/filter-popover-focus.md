---
name: Filter popover focus
description: Keep adjacent searchable filters responsive when switching between fields.
---

For adjacent location-search filters, prioritize immediate focus handoff over dropdown exit animations.

**Why:** During verification, a closing dropdown's delayed focus restoration interfered with opening and typing in the next filter. Instant close behavior eliminated the interference and restored reliable Escape-to-trigger focus.

**How to apply:** Keep these frequent-use filter popovers unanimated. If animation is reintroduced, test rapid switching, keyboard selection, and Escape focus restoration across both fields, not just each dropdown in isolation.
