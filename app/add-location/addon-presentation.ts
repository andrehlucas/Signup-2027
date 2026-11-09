import { isAddonIncludedInBundle, type Addon, type Bundle } from './types';

const preferredAddonIds = [
  'callout',
  'custom-business-email',
  'supervised-transfer',
  'message-taking',
  'appointment-scheduling',
];

export function sortCustomizationAddons(addons: Addon[]): Addon[] {
  const priorities = new Map(preferredAddonIds.map((id, index) => [id, index]));
  return addons
    .filter(addon => addon.id !== 'additional-extensions')
    .sort((a, b) => (priorities.get(a.id) ?? preferredAddonIds.length) - (priorities.get(b.id) ?? preferredAddonIds.length));
}

export function getInitialCustomizationAddons(addons: Addon[], bundle: Bundle | null): Addon[] {
  const { optionalAddons } = partitionCustomizationAddons(addons, bundle);
  const required = optionalAddons.filter(addon => preferredAddonIds.includes(addon.id));
  const visibleIds = new Set(required.map(addon => addon.id));
  const targetCount = Math.min(optionalAddons.length, Math.ceil(Math.max(2, visibleIds.size) / 2) * 2);
  for (const addon of optionalAddons) {
    if (visibleIds.size >= targetCount) break;
    visibleIds.add(addon.id);
  }
  return optionalAddons.filter(addon => visibleIds.has(addon.id));
}

export function partitionCustomizationAddons(addons: Addon[], bundle: Bundle | null) {
  const includedAddons: Addon[] = [];
  const optionalAddons: Addon[] = [];
  for (const addon of addons) {
    if (addon.id === 'additional-extensions') continue;
    (isAddonIncludedInBundle(addon.id, bundle) ? includedAddons : optionalAddons).push(addon);
  }
  return { includedAddons, optionalAddons };
}
