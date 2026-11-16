import type { CSSProperties } from 'react';

export interface BundleTheme {
  surface: string;
  accent: string;
  border: string;
}

// The same tier colors identify bundles and the services they include.
export const bundleThemes: Record<string, BundleTheme> = {
  plus: { surface: '#edf6f4', accent: '#185f58', border: '#b9d7d1' },
  pro: { surface: '#eef2f8', accent: '#345b91', border: '#bdcbe0' },
  premium: { surface: '#f7f2e9', accent: '#80591e', border: '#d9c8a7' },
  prestige: { surface: '#f5eef3', accent: '#754965', border: '#d6c0cf' },
};

// The baseline plan's neutral tier colours (summary price label).
export const essentialsTierTheme: BundleTheme = { surface: '#f2f4f6', accent: '#596579', border: '#dfe3e8' };

/**
 * Scope a tier's colours onto Astryx's own tokens for one subtree, so
 * <Card>, <Text color="accent"> and <Icon color="accent"> inside it render in
 * that tier. Values reference the --opus-tier-* tokens the Opus theme emits
 * (app/themes/opus/opusTheme.ts); no raw colours live in components.
 */
export function tierScope(id: string): CSSProperties {
  const tier = id === 'essentials' || id in bundleThemes ? id : 'plus';
  return {
    '--color-text-accent': `var(--opus-tier-${tier}-accent)`,
    '--color-icon-accent': `var(--opus-tier-${tier}-accent)`,
    '--color-background-card': `var(--opus-tier-${tier}-surface)`,
    '--color-border': `var(--opus-tier-${tier}-border)`,
  } as CSSProperties;
}
