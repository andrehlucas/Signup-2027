---
name: Preview proxy boundary
description: Distinguish Replit Preview's saved URL from the server's internal listening port.
---

A Preview URL containing a literal public `:5000` has returned `502` with `replit-proxy-error: repl unreachable` while the same development domain without an explicit port returned `200`. This is distinct from the app listening internally on port 5000.

**Why:** Repeated restarts did not resolve the saved URL. An additional development redirect listener and external-port mapping also could not intercept the failing public request; that workaround was removed.

**How to apply:** Compare the actual public Preview URL with the normal forwarded URL and inspect proxy error headers before changing application code. Keep the standard webview/internal-5000/external-80 configuration. An error returned before the app is reached requires fixing Preview routing or its saved address, not a client-side or Next.js redirect. Do not claim that an internal screenshot or a healthy normal URL proves the user's separate port-specific URL works.
