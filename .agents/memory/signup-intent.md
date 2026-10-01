---
name: Signup intent and external checkout
description: Payment belongs to the existing PHP checkout; this project prepares selections and redirects.
---

Treat recorded signup details as unpaid selections, not purchases or activated services. The final program action is the plan-choice button within each card, which leads to an existing external PHP checkout, not an in-app signup-success screen.

**Why:** The user explicitly said their PHP checkout page already exists and asked to prepare this project without building the final page or supplying its destination yet.

**How to apply:** Do not introduce a new payment provider or build a replacement checkout page. Keep the destination configurable and defer customer/selection field mapping until the PHP contract is supplied; do not invent parameters or expose contact details in redirect URLs. Missing configuration must not claim completion or activate services. Preserve pending-navigation locks and allow errors to leave selections editable.