---
name: Design-system linking in the Tailwind 3 app
description: Why the app uses a source alias for the local design-system package instead of a normal package install.
---

The Tailwind 3 app consumes the local Opus design system through a TypeScript source alias and scans its component source directly.

**Why:** Fresh npm resolution is blocked because the package firewall rejects the installed Next.js 15 line, even though the existing Replit-managed dependency tree runs and builds successfully on Next.js 15.5.22. Forcing a Next.js 16 migration only to create a local package symlink would be a risky, unrelated major upgrade.

**How to apply:** Keep using the source alias until the app is deliberately upgraded to a firewall-approved Next.js release. After that upgrade, replace the alias with a normal direct workspace/file dependency and regenerate the package lock.