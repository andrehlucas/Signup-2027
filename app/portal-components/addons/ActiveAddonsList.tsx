'use client';

import { useState } from 'react';
import { Addon, DeliveryMethod } from './types';
import { ActiveAddonItem } from './ActiveAddonItem';
import { SupervisedTransferModal } from './SupervisedTransferModal';
import { MessageTakingModal } from './MessageTakingModal';
import { PhoneNumberModal } from './PhoneNumberModal';

interface ActiveAddonsListProps {
  addons: Addon[];
  onAddonUpdate?: (addonId: string, config: Addon['config']) => void;
  onViewInstructions?: (addon: Addon) => void;
  title?: string;
  showOnlyActive?: boolean;
}

export function ActiveAddonsList({
  addons,
  onAddonUpdate,
  onViewInstructions,
  title = 'Active Addons',
  showOnlyActive = true,
}: ActiveAddonsListProps) {
  const [supervisedTransferOpen, setSupervisedTransferOpen] = useState(false);
  const [messageTakingOpen, setMessageTakingOpen] = useState(false);
  const [tollFreeOpen, setTollFreeOpen] = useState(false);
  const [additionalPhoneOpen, setAdditionalPhoneOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);

  const filteredAddons = showOnlyActive
    ? addons.filter((addon) => addon.status === 'active')
    : addons;

  const handleEdit = (addon: Addon) => {
    setCurrentAddon(addon);
    
    switch (addon.modalType) {
      case 'supervised-transfer':
        setSupervisedTransferOpen(true);
        break;
      case 'message-taking':
        setMessageTakingOpen(true);
        break;
      case 'toll-free':
        setTollFreeOpen(true);
        break;
      case 'additional-phone':
        setAdditionalPhoneOpen(true);
        break;
      default:
        break;
    }
  };

  const handleViewInstructions = (addon: Addon) => {
    if (onViewInstructions) {
      onViewInstructions(addon);
    } else if (addon.instructionsUrl) {
      window.open(addon.instructionsUrl, '_blank');
    }
  };

  const handleSupervisedTransferSave = (availableForCalls: boolean) => {
    if (currentAddon && onAddonUpdate) {
      onAddonUpdate(currentAddon.id, {
        ...currentAddon.config,
        supervisedTransfer: { availableForCalls },
      });
    }
    setCurrentAddon(null);
  };

  const handleMessageTakingSave = (deliveryMethod: DeliveryMethod, termsAccepted: boolean) => {
    if (currentAddon && onAddonUpdate) {
      onAddonUpdate(currentAddon.id, {
        ...currentAddon.config,
        messageTaking: { deliveryMethod, termsAccepted },
      });
    }
    setCurrentAddon(null);
  };

  const handlePhoneNumberSave = (selectedNumber: string) => {
    if (currentAddon && onAddonUpdate) {
      onAddonUpdate(currentAddon.id, {
        ...currentAddon.config,
        phoneNumber: {
          ...currentAddon.config?.phoneNumber,
          selectedNumber,
          availableNumbers: currentAddon.config?.phoneNumber?.availableNumbers || [],
        },
      });
    }
    setCurrentAddon(null);
  };

  if (filteredAddons.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" data-testid="active-addons-list">
      <h3 className="text-base font-semibold text-gray-900 mb-3" data-testid="text-addons-title">
        {title}
      </h3>
      <div className="divide-y divide-gray-100">
        {filteredAddons.map((addon) => (
          <ActiveAddonItem
            key={addon.id}
            addon={addon}
            onEdit={handleEdit}
            onViewInstructions={handleViewInstructions}
          />
        ))}
      </div>

      <SupervisedTransferModal
        isOpen={supervisedTransferOpen}
        onClose={() => {
          setSupervisedTransferOpen(false);
          setCurrentAddon(null);
        }}
        initialValue={currentAddon?.config?.supervisedTransfer?.availableForCalls}
        onSave={handleSupervisedTransferSave}
      />

      <MessageTakingModal
        isOpen={messageTakingOpen}
        onClose={() => {
          setMessageTakingOpen(false);
          setCurrentAddon(null);
        }}
        initialDeliveryMethod={currentAddon?.config?.messageTaking?.deliveryMethod}
        initialTermsAccepted={currentAddon?.config?.messageTaking?.termsAccepted}
        onSave={handleMessageTakingSave}
      />

      <PhoneNumberModal
        isOpen={tollFreeOpen}
        onClose={() => {
          setTollFreeOpen(false);
          setCurrentAddon(null);
        }}
        title="Select Toll-Free Number"
        availableNumbers={currentAddon?.config?.phoneNumber?.availableNumbers || []}
        selectedNumber={currentAddon?.config?.phoneNumber?.selectedNumber}
        onSave={handlePhoneNumberSave}
      />

      <PhoneNumberModal
        isOpen={additionalPhoneOpen}
        onClose={() => {
          setAdditionalPhoneOpen(false);
          setCurrentAddon(null);
        }}
        title="Select Additional Phone Number"
        availableNumbers={currentAddon?.config?.phoneNumber?.availableNumbers || []}
        selectedNumber={currentAddon?.config?.phoneNumber?.selectedNumber}
        onSave={handlePhoneNumberSave}
      />
    </div>
  );
}
