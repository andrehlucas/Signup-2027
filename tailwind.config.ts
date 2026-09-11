import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./artifacts/opus-vo-design-system/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          25: "var(--brand-25)", 50: "var(--brand-50)", 100: "var(--brand-100)", 200: "var(--brand-200)",
          300: "var(--brand-300)", 400: "var(--brand-400)", 500: "var(--brand-500)", 600: "var(--brand-600)",
          700: "var(--brand-700)", 800: "var(--brand-800)", 900: "var(--brand-900)",
        },
        gray: {
          25: "var(--gray-25)", 50: "var(--gray-50)", 100: "var(--gray-100)", 200: "var(--gray-200)",
          300: "var(--gray-300)", 400: "var(--gray-400)", 500: "var(--gray-500)", 600: "var(--gray-600)",
          700: "var(--gray-700)", 800: "var(--gray-800)", 900: "var(--gray-900)", 950: "var(--gray-950)",
        },
        error: {
          25: "var(--error-25)", 50: "var(--error-50)", 100: "var(--error-100)", 200: "var(--error-200)",
          300: "var(--error-300)", 400: "var(--error-400)", 500: "var(--error-500)", 600: "var(--error-600)",
          700: "var(--error-700)", 800: "var(--error-800)", 900: "var(--error-900)", 950: "var(--error-950)",
        },
        warning: {
          25: "var(--warning-25)", 50: "var(--warning-50)", 100: "var(--warning-100)", 200: "var(--warning-200)",
          300: "var(--warning-300)", 400: "var(--warning-400)", 500: "var(--warning-500)", 600: "var(--warning-600)",
          700: "var(--warning-700)", 800: "var(--warning-800)", 900: "var(--warning-900)", 950: "var(--warning-950)",
        },
        success: {
          25: "var(--success-25)", 50: "var(--success-50)", 100: "var(--success-100)", 200: "var(--success-200)",
          300: "var(--success-300)", 400: "var(--success-400)", 500: "var(--success-500)", 600: "var(--success-600)",
          700: "var(--success-700)", 800: "var(--success-800)", 900: "var(--success-900)", 950: "var(--success-950)",
        },
        "gray-blue": {
          25: "var(--gray-blue-25)", 50: "var(--gray-blue-50)", 100: "var(--gray-blue-100)", 200: "var(--gray-blue-200)",
          300: "var(--gray-blue-300)", 400: "var(--gray-blue-400)", 500: "var(--gray-blue-500)", 600: "var(--gray-blue-600)",
          700: "var(--gray-blue-700)", 800: "var(--gray-blue-800)", 900: "var(--gray-blue-900)",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};

export default config;
