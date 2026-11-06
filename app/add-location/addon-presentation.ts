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
  return addons.filter(addon =>
    preferredAddonIds.includes(addon.id) || isAddonIncludedInBundle(addon.id, bundle)
  );
}
