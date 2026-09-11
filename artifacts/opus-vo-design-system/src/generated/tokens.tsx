/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
//
// color.light / color.dark  — semantic role tokens for each mode
// primitives                — full brand/gray/error/warning/success/grayBlue ramps
export const tokens = {
  "color": {
    "light": {
      "background": "#ffffff",
      "foreground": "#181d27",
      "border": "#e9eaeb",
      "card": "#ffffff",
      "cardForeground": "#181d27",
      "popover": "#ffffff",
      "popoverForeground": "#181d27",
      "primary": "#026aa2",
      "primaryForeground": "#ffffff",
      "secondary": "#f5f5f5",
      "secondaryForeground": "#414651",
      "muted": "#f5f5f5",
      "mutedForeground": "#717680",
      "accent": "#e0f2fe",
      "accentForeground": "#026aa2",
      "destructive": "#f04438",
      "destructiveForeground": "#ffffff",
      "input": "#d5d7da",
      "ring": "#7cd4fd",
      "chart1": "#026aa2",
      "chart2": "#17b26a",
      "chart3": "#f79009",
      "chart4": "#4e5ba6",
      "chart5": "#f04438",
      "sidebar": "#f8f9fc",
      "sidebarForeground": "#414651",
      "sidebarBorder": "#e9eaeb",
      "sidebarPrimary": "#026aa2",
      "sidebarPrimaryForeground": "#ffffff",
      "sidebarAccent": "#e0f2fe",
      "sidebarAccentForeground": "#026aa2",
      "sidebarRing": "#7cd4fd"
    },
    "dark": {
      "background": "#0a0d12",
      "foreground": "#fafafa",
      "border": "#252b37",
      "card": "#13161b",
      "cardForeground": "#fafafa",
      "popover": "#13161b",
      "popoverForeground": "#fafafa",
      "primary": "#36bffa",
      "primaryForeground": "#062c41",
      "secondary": "#22262f",
      "secondaryForeground": "#cecfd2",
      "muted": "#22262f",
      "mutedForeground": "#94979c",
      "accent": "#0b4a6f",
      "accentForeground": "#7cd4fd",
      "destructive": "#b42318",
      "destructiveForeground": "#fef3f2",
      "input": "#373a41",
      "ring": "#026aa2",
      "chart1": "#36bffa",
      "chart2": "#47cd89",
      "chart3": "#fdb022",
      "chart4": "#717bbc",
      "chart5": "#f97066",
      "sidebar": "#13161b",
      "sidebarForeground": "#cecfd2",
      "sidebarBorder": "#252b37",
      "sidebarPrimary": "#36bffa",
      "sidebarPrimaryForeground": "#062c41",
      "sidebarAccent": "#0b4a6f",
      "sidebarAccentForeground": "#7cd4fd",
      "sidebarRing": "#026aa2"
    }
  },
  "primitives": {
    "brand": {
      "25": "#f5fbff",
      "50": "#e0f2fe",
      "100": "#b9e6fe",
      "200": "#7cd4fd",
      "300": "#36bffa",
      "400": "#0ba5ec",
      "500": "#0086c9",
      "600": "#026aa2",
      "700": "#065986",
      "800": "#0b4a6f",
      "900": "#062c41"
    },
    "gray": {
      "25": "#fdfdfd",
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e9eaeb",
      "300": "#d5d7da",
      "400": "#a4a7ae",
      "500": "#717680",
      "600": "#535862",
      "700": "#414651",
      "800": "#252b37",
      "900": "#181d27",
      "950": "#0a0d12"
    },
    "error": {
      "25": "#fffbfa",
      "50": "#fef3f2",
      "100": "#fee4e2",
      "200": "#fecdca",
      "300": "#fda29b",
      "400": "#f97066",
      "500": "#f04438",
      "600": "#d92d20",
      "700": "#b42318",
      "800": "#912018",
      "900": "#7a271a",
      "950": "#55160c"
    },
    "warning": {
      "25": "#fffcf5",
      "50": "#fffaeb",
      "100": "#fef0c7",
      "200": "#fedf89",
      "300": "#fec84b",
      "400": "#fdb022",
      "500": "#f79009",
      "600": "#dc6803",
      "700": "#b54708",
      "800": "#93370d",
      "900": "#7a2e0e",
      "950": "#4e1d09"
    },
    "success": {
      "25": "#f6fef9",
      "50": "#ecfdf3",
      "100": "#dcfae6",
      "200": "#abefc6",
      "300": "#75e0a7",
      "400": "#47cd89",
      "500": "#17b26a",
      "600": "#079455",
      "700": "#067647",
      "800": "#085d3a",
      "900": "#074d31",
      "950": "#053321"
    },
    "grayBlue": {
      "25": "#fcfcfd",
      "50": "#f8f9fc",
      "100": "#eaecf5",
      "200": "#d5d9eb",
      "300": "#b3b8db",
      "400": "#717bbc",
      "500": "#4e5ba6",
      "600": "#3e4784",
      "700": "#363f72",
      "800": "#293056",
      "900": "#101323"
    }
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "ui-serif",
      "serif"
    ],
    "mono": [
      "Menlo",
      "ui-monospace",
      "monospace"
    ]
  },
  "radius": "0.5rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
