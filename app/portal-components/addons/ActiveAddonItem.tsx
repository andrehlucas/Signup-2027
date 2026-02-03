'use client';

import { Button } from '@/app/components/ui/button';
import { Addon } from './types';

interface ActiveAddonItemProps {
  addon: Addon;
  onEdit?: (addon: Addon) => void;
  onViewInstructions?: (addon: Addon) => void;
}

export function ActiveAddonItem({
  addon,
  onEdit,
  onViewInstructions,
}: ActiveAddonItemProps) {
  const handleAction = () => {
    if (addon.actionType === 'edit' && onEdit) {
      onEdit(addon);
    } else if (addon.actionType === 'view' && onViewInstructions) {
      onViewInstructions(addon);
    }
  };

  return (
    <div
      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      data-testid={`addon-item-${addon.id}`}
    >
      <div className="flex-1">
        <span className="text-sm text-gray-800" data-testid={`addon-name-${addon.id}`}>
          {addon.name}
        </span>
        {addon.description && (
          <span className="text-sm text-gray-500 ml-1" data-testid={`addon-description-${addon.id}`}>
            ({addon.description})
          </span>
        )}
      </div>
      <Button
        variant="link"
        size="sm"
        onClick={handleAction}
        className="text-[#36bff9] hover:text-[#2ba8e0] p-0 h-auto font-normal"
        data-testid={`button-${addon.actionType}-${addon.id}`}
      >
        {addon.actionType === 'edit' ? 'Edit' : 'View Instructions'}
      </Button>
    </div>
  );
}
