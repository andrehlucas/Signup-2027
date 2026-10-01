---
name: Signup intent and completion semantics
description: Signup records are unpaid selections, not purchases or activated services.
---

Treat completing signup as recording contact information, location, program, and billing preference, not as collecting payment or activating a paid service.

**Why:** The user explicitly requested completion without payment. Adding a priced program-selection stage did not authorize checkout, charging, or service activation.

**How to apply:** Keep prices informational and save authoritative catalog quotes. Introduce payment or activation only on an explicit later request. Own pending signup state in the persistent flow context, since browser history can bypass disabled in-page navigation and otherwise allow a response to complete a changed selection.