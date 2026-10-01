---
name: Signup intent and completion semantics
description: Signup records are unpaid selections, not purchases or activated services.
---

Treat completing signup as recording contact information, location, program, and billing preference, not as collecting payment or activating a paid service.

**Why:** The implemented signup was explicitly requested without payment. The user later chose to restore the previous checkout in the main app with payment processing remaining a separate step. The historical checkout only saved a location; its card fields were not evidence of a working payment integration.

**How to apply:** Restoring the previous checkout authorizes review/navigation changes, not charging or service activation. Do not treat checkout labels or card-field visuals as evidence of payment capability, and do not collect raw card details without a processor. Own pending signup state in the persistent flow context, since browser history can bypass disabled in-page navigation and otherwise allow a response to complete a changed selection.