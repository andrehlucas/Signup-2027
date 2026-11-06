---
name: Press feedback inside swipeable cards
description: Why bundle-button touch feedback needs explicit pointer lifecycle handling.
---

Do not rely solely on native CSS `:active` for touch press feedback inside the swipeable bundle carousel.

**Why:** Real Chromium touch input reached the correct button but did not activate `:active` inside the draggable cards, despite desktop mouse feedback working. Explicit pointer feedback restored the touch response.

**How to apply:** Keep pointer feedback independent of keyboard activation, clear it on release/cancellation/leave/capture loss, and verify touch hold, release, cancellation and swipe-through-button behavior. Do not prevent the carousel's drag events just to produce a pressed style.
