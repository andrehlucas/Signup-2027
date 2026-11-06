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
