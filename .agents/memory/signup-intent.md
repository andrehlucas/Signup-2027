---
name: Signup intent and completion semantics
description: Signup records are unpaid selections, not purchases or activated services.
---

Treat completing signup as recording contact information, location, program, and billing preference, not as collecting payment or activating a paid service.

**Why:** The implemented signup was explicitly requested without payment. The user has since specified that the program-card buttons should eventually proceed to payment and requested “Continue to payment” copy in the canvas preview. This changes the intended next step, but does not by itself connect checkout or authorize charging.

**How to apply:** Preserve the existing unpaid application behavior until payment implementation is requested. Do not treat payment-oriented mockup copy as evidence that checkout exists. When checkout is implemented, reconcile the remaining no-payment copy with that flow. Own pending signup state in the persistent flow context, since browser history can bypass disabled in-page navigation and otherwise allow a response to complete a changed selection.