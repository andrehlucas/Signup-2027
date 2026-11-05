---
name: State-dependent visual checks
description: Safely verifying enrollment screens that need an existing order.
---

Verify later enrollment pages in one browser session that progresses through signup. Do not submit checkout or add a state/auth bypass solely to obtain a confirmation screenshot.

**Why:** Fresh screenshot captures have no enrollment state, while checkout submission can mutate application records even during a visual-only request.

**How to apply:** Keep the real draft state while navigating between enrollment screens, and visit confirmation for presentation checks without submitting a purchase. If that is unavailable, distinguish source review from rendered verification explicitly.
