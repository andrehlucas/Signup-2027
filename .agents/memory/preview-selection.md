---
name: Preview selection and managed artifact services
description: Why checking the main app alone does not prove the selected workspace preview is fixed.
---

Verify the endpoint of the selected artifact, not just the main application's endpoint, when changing which page opens in the preview. Stopping an artifact workflow does not unregister it or change the preview selection.

**Why:** The workspace continued displaying the design-system presentation after the main signup app was confirmed working. The selected artifact still owned a different endpoint, and its managed service restarted.

**How to apply:** Check the registered artifact's service and capture that exact port before declaring the startup page corrected. Preserve shared component sources when retiring a presentation. Artifact TOML files are platform-managed; direct edits are rejected and require the supported replacement flow.