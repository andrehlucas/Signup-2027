---
name: State-dependent visual checks
description: Safely verifying enrollment screens that need an existing order.
---

Verify later enrollment pages in one browser session that progresses through signup. Do not submit checkout or add a state/auth bypass solely to obtain a confirmation screenshot.

**Why:** Fresh screenshot captures have no enrollment state, while checkout submission can mutate application records even during a visual-only request.

**How to apply:** Keep the real draft state while navigating between enrollment screens, and visit confirmation for presentation checks without submitting a purchase. If that is unavailable, distinguish source review from rendered verification explicitly.

Verify interactivity, not just server-rendered markup, before testing the flow.

**Why:** Development asset reload failures can leave a readable form without hydrated client handlers. An HTTP 200 and visible fields do not prove that the enrollment flow works.

**How to apply:** Start with a clean automation cache and wait for client hydration, then retain that interactive session for the state-dependent screens.
