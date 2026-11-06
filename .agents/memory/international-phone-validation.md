---
name: International phone validation
description: Avoid false rejections for territories sharing calling codes and number ranges.
---

Validate contact numbers against international numbering metadata and the selected calling code, not strict equality between the selected territory and the territory inferred from the number.

**Why:** Some countries and territories share both calling codes and mobile ranges, such as Åland and Finland. A valid number can resolve to the other territory; strict region equality rejects legitimate customers.

**How to apply:** Preserve the user's selected territory for national entry and draft recovery. Resolve the country when pasting an international number where possible, but do not claim phone-number validation proves ownership or reachability.
