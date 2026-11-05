---
name: Enrollment draft policy
description: Intent behind enrollment continuity, privacy limits and location-change behavior.
---

Location selection and changing a location are the same task. Preserve the customer's plan and optional services when changing the address; explain any genuinely incompatible selection instead of silently resetting it.

**Why:** The user explicitly approved consistent selectors with saved state after discovering different behavior between initial selection and editing.

**How to apply:** Reuse the same selector and preserve purchase intent when adding locations or eligibility rules.

Draft recovery is deliberately limited to the current browser-tab session, with short-lived drafts, rather than indefinite cross-session storage.

**Why:** Enrollment contains contact details. Refresh recovery should not leave an indefinitely remembered enrollment on a shared device or be mistaken for an account-backed saved order.

**How to apply:** Keep card details out of draft persistence and require fresh final agreement consent. If longer-term or cross-device recovery is requested, treat that as a separate privacy and authenticated-storage decision.
