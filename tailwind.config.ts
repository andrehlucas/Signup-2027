import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        basewhite: "var(--basewhite)",
        "black-900": "var(--black-900)",
        "blue-light100": "var(--blue-light100)",
        "blue-light400": "var(--blue-light400)",
        "blue-light700": "var(--blue-light700)",
        "brand-100": "var(--brand-100)",
        "brand-50": "var(--brand-50)",
        "brand-500": "var(--brand-500)",
        "brand-600": "var(--brand-600)",
        "brand-700": "var(--brand-700)",
        "building-bg": "var(--building-bg)",
        "error-600": "var(--error-600)",
        "gray-100": "var(--gray-100)",
        "gray-200": "var(--gray-200)",
        "gray-300": "var(--gray-300)",
        "gray-400": "var(--gray-400)",
        "gray-50": "var(--gray-50)",
        "gray-500": "var(--gray-500)",
        "gray-600": "var(--gray-600)",
        "gray-700": "var(--gray-700)",
        "gray-800": "var(--gray-800)",
        "gray-900": "var(--gray-900)",
        "gray-light-mode300": "var(--gray-light-mode300)",
        "warning-300": "var(--warning-300)",
        "warning-400": "var(--warning-400)",
        white: "var(--white)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Button component design tokens
        "brand-solid": "var(--bg-brand-solid)",
        "brand-solid_hover": "var(--bg-brand-solid_hover)",
        "bg-primary": "var(--bg-primary)",
        "bg-primary_hover": "var(--bg-primary_hover)",
        disabled: "var(--bg-disabled)",
        "disabled_subtle": "var(--ring-disabled_subtle)",
        "error-solid": "var(--bg-error-solid)",
        "error-primary": "var(--bg-error-primary)",
        "error-primary_hover": "var(--text-error-primary_hover)",
        "error_subtle": "var(--ring-error_subtle)",
        "fg-disabled": "var(--fg-disabled)",
        "fg-disabled_subtle": "var(--fg-disabled_subtle)",
        "fg-quaternary": "var(--fg-quaternary)",
        "fg-quaternary_hover": "var(--fg-quaternary_hover)",
        "fg-brand-secondary_alt": "var(--fg-brand-secondary_alt)",
        "fg-brand-secondary_hover": "var(--fg-brand-secondary_hover)",
        "fg-error-secondary": "var(--fg-error-secondary)",
        "fg-error-primary": "var(--fg-error-primary)",
        "text-white": "var(--text-white)",
        "text-secondary": "var(--text-secondary)",
        "text-secondary_hover": "var(--text-secondary_hover)",
        "text-tertiary": "var(--text-tertiary)",
        "text-tertiary_hover": "var(--text-tertiary_hover)",
        "text-brand-secondary": "var(--text-brand-secondary)",
        "text-brand-secondary_hover": "var(--text-brand-secondary_hover)",
        "text-error-primary": "var(--text-error-primary)",
        "button-primary-icon": "var(--button-primary-icon)",
        "button-primary-icon_hover": "var(--button-primary-icon_hover)",
        "button-destructive-primary-icon": "var(--button-destructive-primary-icon)",
        "button-destructive-primary-icon_hover": "var(--button-destructive-primary-icon_hover)",
      },
      fontFamily: {
        "display-md-semibold": "var(--display-md-semibold-font-family)",
        "display-sm-display-md-semibold":
          "var(--display-sm-display-md-semibold-font-family)",
        "display-sm-semibold": "var(--display-sm-semibold-font-family)",
        "display-xs-semibold": "var(--display-xs-semibold-font-family)",
        "text-lg-medium": "var(--text-lg-medium-font-family)",
        "text-lg-regular": "var(--text-lg-regular-font-family)",
        "text-lg-semibold": "var(--text-lg-semibold-font-family)",
        "text-md-regular": "var(--text-md-regular-font-family)",
        "text-md-semibold": "var(--text-md-semibold-font-family)",
        "text-sm-medium": "var(--text-sm-medium-font-family)",
        "text-sm-regular": "var(--text-sm-regular-font-family)",
        "text-sm-semibold": "var(--text-sm-semibold-font-family)",
        "text-sm-text-md-bold": "var(--text-sm-text-md-bold-font-family)",
        "text-sm-text-md-medium": "var(--text-sm-text-md-medium-font-family)",
        "text-sm-text-md-regular": "var(--text-sm-text-md-regular-font-family)",
        "text-sm-text-md-semibold":
          "var(--text-sm-text-md-semibold-font-family)",
        "text-xl-medium": "var(--text-xl-medium-font-family)",
        "text-xl-regular": "var(--text-xl-regular-font-family)",
        "text-xl-semibold": "var(--text-xl-semibold-font-family)",
        "text-xs-bold": "var(--text-xs-bold-font-family)",
        "text-xs-medium": "var(--text-xs-medium-font-family)",
        "text-xs-regular": "var(--text-xs-regular-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "backdrop-blurs-backdrop-blur-lg":
          "var(--backdrop-blurs-backdrop-blur-lg)",
        "backdrop-blurs-backdrop-blur-md":
          "var(--backdrop-blurs-backdrop-blur-md)",
        "shadows-shadow-lg": "var(--shadows-shadow-lg)",
        "shadows-shadow-md": "var(--shadows-shadow-md)",
        "shadows-shadow-sm": "var(--shadows-shadow-sm)",
        "shadows-shadow-xs": "var(--shadows-shadow-xs)",
        "shadows-shadow-xs-skeuomorphic":
          "var(--shadows-shadow-xs-skeuomorphic)",
        "xs": "var(--shadows-shadow-xs)",
        "xs-skeumorphic": "0 0 0 1px var(--shadow-skeumorphic-inner-border) inset, 0 -2px 0 0 var(--shadow-skeumorphic-inner) inset, 0 1px 2px 0 var(--shadow-skeuomorphic-ambient)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "4.5": "1.125rem",
      },
      outlineColor: {
        brand: "var(--outline-brand)",
        error: "var(--outline-error)",
      },
      ringColor: {
        primary: "var(--ring-primary)",
        "disabled_subtle": "var(--ring-disabled_subtle)",
        "error_subtle": "var(--ring-error_subtle)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }: any) {
      addUtilities({
        '.transition-inherit-all': {
          transition: 'inherit all',
        },
        '.mask-b-from-0\\%': {
          'mask-image': 'linear-gradient(to bottom, white 0%, transparent 100%)',
          '-webkit-mask-image': 'linear-gradient(to bottom, white 0%, transparent 100%)',
        },
      });
    },
  ],
  darkMode: ["class"],
};

export default config;
