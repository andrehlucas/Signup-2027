---
name: Enrollment draft policy
description: Intent behind enrollment continuity, privacy limits and location-change behavior.
---

Location selection and changing a location are the same task. Preserve the customer's plan and optional services when changing the address; explain any genuinely incompatible selection instead of silently resetting it.

**Why:** The user explicitly approved consistent selectors with saved state after discovering different behavior between initial selection and editing.

**How to apply:** Reuse the same selector and preserve purchase intent when adding locations or eligibility rules.

Returning to completed Step 2 from Customize means confirming the existing plan, address and business number, not restarting location search.

**Why:** The user explicitly requested the confirmation screen when using “Pick Your Location” to navigate back from Customize.

**How to apply:** Direct completed-step navigation to plan/location review, preserve the bundle and optional add-ons, and reserve the location picker for initial selection or the explicit Change location action.

Draft recovery is deliberately limited to the current browser-tab session, with short-lived drafts, rather than indefinite cross-session storage.

**Why:** Enrollment contains contact details. Refresh recovery should not leave an indefinitely remembered enrollment on a shared device or be mistaken for an account-backed saved order.

**How to apply:** Keep card details out of draft persistence and require fresh final agreement consent. If longer-term or cross-device recovery is requested, treat that as a separate privacy and authenticated-storage decision.

Preview reset requests should affect only the requesting browser tab, not invalidate other enrollments or change production behavior.

**Why:** Restarting the server is separate from clearing a person's browser draft. The user confirmed clearing their own selections and starting over, not resetting every visitor.

**How to apply:** Use an explicit, one-time development reset action. Do not bump the shared draft version just to clear a test session; preserve normal refresh recovery afterward.

A location can offer multiple local phone area codes, not just one.

**Why:** The user explicitly stated that a location may offer multiple area codes and requested a filter for choosing among them.

**How to apply:** Derive supported area codes from that location's available phone inventory, preserve compatible customer choices, and do not treat changing a filter as saving a different number. Prototype options must not be represented as carrier reservations.

When a customer changes bundles after choosing paid add-ons, immediately exclude newly included services from the displayed total and paid-add-on breakdown.

**Why:** Returning to plan review can retain earlier paid selections before a later step cleans them up. Showing the raw stored extras would temporarily charge the same service twice.

**How to apply:** Derive billable extras from the current bundle's inclusions, not merely from stored add-on presence. Preserve genuinely optional selections across steps; retired Additional Extensions must not produce charges.

Office search offers United States by default, Canada and Puerto Rico as country/region choices, independently of the customer's contact-phone country.

**Why:** The user requested these three choices with US preselected.

**How to apply:** Scope states/provinces and cities to the office country, reset those search filters on country changes, and preserve the previously confirmed office/plan until another actual location is selected. Do not invent overseas inventory to populate an empty region.

A fresh location search starts with no office results until a state/province/territory or city is selected.

**Why:** The user explicitly requested empty results on first load rather than automatically listing offices.

**How to apply:** Show a search prompt before a geographic selection, distinguish it from a real search with no matches, and return to that prompt when filters are cleared. A country choice alone is not a search. Keep saved geographic searches and selected-office editing intact rather than wiping an existing draft on every visit.
