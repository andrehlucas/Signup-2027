import assert from 'node:assert/strict';
import test from 'node:test';
import { bundleThemes } from './bundle-theme';

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test('each tier has distinct, readable included-service colors', () => {
  assert.deepEqual(Object.keys(bundleThemes), ['plus', 'pro', 'premium', 'prestige']);
  assert.equal(new Set(Object.values(bundleThemes).map(theme => theme.surface)).size, 4);
  for (const [tier, theme] of Object.entries(bundleThemes)) {
    for (const background of [theme.surface, '#ffffff']) {
      const contrast = (luminance(background) + 0.05) / (luminance(theme.accent) + 0.05);
      assert.ok(contrast >= 4.5, `${tier} text contrast ${contrast.toFixed(2)} is below 4.5:1`);
    }
  }
});
