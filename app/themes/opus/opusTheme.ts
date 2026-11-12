/*
 * Opus Virtual Offices theme for Astryx.
 *
 * Source of truth for values: DESIGN.md (colors, typography, rounded,
 * components). Where DESIGN.md and the live UI differ, the live UI wins and
 * the difference is noted inline.
 *
 * Light mode only: the app pins <Theme mode="light">. Colors are single
 * values, so dark mode is not designed. Give each color a [light, dark] tuple
 * before enabling it.
 *
 * After editing, rebuild the static CSS/JS the app loads:
 *   npx astryx theme build app/themes/opus/opusTheme.ts
 */
import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

// DESIGN.md palette
const actionCharcoal = '#344054';
const brandBlue = '#36bff9';
const brandBlueInk = '#006d91';
const softBlue = '#eaf8fe'; // --opus-soft-blue in globals.css
const pageGray = '#f9fafb';
const surfaceWhite = '#ffffff';
const mutedGray = '#f2f4f7';
const textPrimary = '#101828';
const textMuted = '#475467';
const iconMuted = '#667085';
const borderSubtle = '#eaecf0';
// DESIGN.md lists hsl(214.3 31.8% 91.4%), but the live inputs use
// `border-input` (--input: 214 20% 85%), which also reads better on white.
const fieldBorder = 'hsl(214 20% 85%)';

// next/font loads Inter under a generated family name and exposes it as
// --font-inter on <html> (app/layout.tsx), so reference the variable.
const interStack =
  'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// DESIGN.md typography. Applied at the root and again in the phone
// adaptation below, because the neutral theme's phone rule regenerates the
// whole type scale (and the font stacks) and would otherwise override these.
const typeTokens = {
  '--font-family-body': interStack,
  '--font-family-heading': interStack,
  // h1 = headline 30/36 bold
  '--text-heading-1-size': '1.875rem',
  '--text-heading-1-weight': '700',
  '--text-heading-1-leading': '1.2',
  // h2 = title 18/28 semibold
  '--text-heading-2-size': '1.125rem',
  '--text-heading-2-weight': '600',
  '--text-heading-2-leading': '1.5556',
  // h3 = body-sized subsection heading, 16/24 semibold
  '--text-heading-3-size': '1rem',
  '--text-heading-3-weight': '600',
  '--text-heading-3-leading': '1.5',
  // body 16/24
  '--text-body-size': '1rem',
  '--text-body-leading': '1.5',
  // label 14/20 medium
  '--text-label-size': '0.875rem',
  '--text-label-weight': '500',
  '--text-label-leading': '1.4286',
  // supporting / helper text 14/20
  '--text-supporting-size': '0.875rem',
  '--text-supporting-leading': '1.4286',
} as const;

export const opusTheme = defineTheme({
  name: 'opus',
  extends: neutralTheme,

  typography: {
    // Body is 16px in DESIGN.md (Astryx default base is 14px).
    scale: { base: 16, ratio: 1.2 },
    // The family field quotes its value, which would break the var()
    // reference, so the stacks are set as tokens below instead.
    body: { family: 'Inter' },
    heading: { family: 'Inter' },
    code: {
      family: 'ui-monospace',
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },

  tokens: {
    ...typeTokens,

    // ---- Color ----
    // Primary actions: Action Charcoal with white text.
    '--color-accent': actionCharcoal,
    '--color-on-accent': surfaceWhite,
    // Selected fills stay quiet; selection is carried by the blue-ink outline.
    '--color-accent-muted': softBlue,
    // Links / active-step labels: Brand Blue Ink (readable on white).
    '--color-text-accent': brandBlueInk,
    '--color-icon-accent': brandBlueInk,

    '--color-text-primary': textPrimary,
    '--color-text-secondary': textMuted,
    '--color-icon-primary': textPrimary,
    '--color-icon-secondary': iconMuted,

    '--color-background-body': pageGray,
    '--color-background-surface': surfaceWhite,
    '--color-background-card': surfaceWhite,
    '--color-background-popover': surfaceWhite,
    '--color-background-muted': mutedGray,

    '--color-border': borderSubtle, // cards, dividers

    // Validation messages: a soft red panel with dark red text (about 6:1),
    // rather than the neutral theme's saturated pink.
    '--color-error-muted': '#fef3f2',
    '--color-on-error-muted': '#b42318',
    '--color-border-emphasized': fieldBorder, // input outlines

    // ---- Focus: restrained blue ring ----
    // Brand Blue (#36bff9) is ~2:1 on white, below the 3:1 a focus indicator
    // needs, so the ring uses Brand Blue Ink as DESIGN.md allows.
    '--focus-outline-color': brandBlueInk,

    // ---- Selection / hover rings on inputs and options ----
    '--shadow-inset-selected': `inset 0px 0px 0px 2px ${brandBlueInk}`,
    '--shadow-inset-hover': `inset 0px 0px 0px 2px ${brandBlue}4D`,

    // ---- Shape (DESIGN.md rounded: sm 6, md 8, lg 12) ----
    '--radius-inner': '0.25rem',
    '--radius-element': '0.375rem', // buttons, fields
    '--radius-container': '0.75rem', // cards

    // ---- Control heights: 48px buttons and fields ----
    '--size-element-sm': '2.25rem',
    '--size-element-md': '3rem',
    '--size-element-lg': '3.5rem',
  },

  adaptations: {
    rules: [
      {
        // Same condition as the inherited neutral rule (touch + narrow);
        // later rules win, so this restores the Opus type tokens on phones.
        when: { pointer: 'coarse', width: { below: 'lg' } },
        value: {
          typography: { scale: { base: 16, ratio: 1.2 } },
          tokens: { ...typeTokens },
        },
      },
    ],
  },

  components: {
    button: {
      // Semibold label; hover darkens #344054 to about #263241
      // (Action Charcoal Hover).
      'variant:primary': {
        fontWeight: '600',
        '--color-overlay-hover': '#0000003D',
        '--color-overlay-pressed': '#00000052',
      },
      // White surface with a fine neutral outline.
      'variant:secondary': {
        backgroundColor: surfaceWhite,
        color: textPrimary,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: fieldBorder,
      },
    },
  },
});
