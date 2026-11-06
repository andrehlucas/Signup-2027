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
  const required = addons.filter(addon =>
    preferredAddonIds.includes(addon.id) || isAddonIncludedInBundle(addon.id, bundle)
  );
  const visibleIds = new Set(required.map(addon => addon.id));
  if (visibleIds.size % 2 !== 0) {
    const nextAddon = addons.find(addon => !visibleIds.has(addon.id));
    if (nextAddon) visibleIds.add(nextAddon.id);
  }
  return addons.filter(addon => visibleIds.has(addon.id));
}
