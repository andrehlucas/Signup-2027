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

Treat generated development bundles as disposable after framework or dependency changes; do not reuse restored build artifacts as proof that the client is compatible.

**Why:** This project's saved development output survived dependency updates and the browser reported missing Webpack modules and failed script parsing even while the server returned successful pages.

**How to apply:** Keep development output separate from production/restored builds, regenerate incompatible caches, and verify a cold, hydrated browser session rather than only a warm reload.

Verify long selection dialogs at short mobile heights, not only mobile widths in a tall viewport.

**Why:** Expanding the phone list exposed footer clipping and scrolling constraints that were not apparent in a tall phone screenshot.

**How to apply:** After viewport emulation settles, check a short screen such as 320×568: the list must scroll independently while filters and Save/Cancel remain reachable. Avoid intrinsic fieldset sizing for a constrained flex scroll region; retain radio-group semantics with an explicitly shrinkable wrapper.
