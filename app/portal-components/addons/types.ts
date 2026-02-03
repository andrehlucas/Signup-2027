export type AddonActionType = 'edit' | 'view';

export type DeliveryMethod = 'email' | 'sms' | 'both';

export interface AddonConfig {
  supervisedTransfer?: {
    availableForCalls: boolean;
  };
  messageTaking?: {
    deliveryMethod: DeliveryMethod;
    termsAccepted: boolean;
  };
  phoneNumber?: {
    selectedNumber: string | null;
    availableNumbers: string[];
  };
}

export interface Addon {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  actionType: AddonActionType;
  description?: string;
  config?: AddonConfig;
  modalType?: 'supervised-transfer' | 'message-taking' | 'toll-free' | 'additional-phone' | 'extension' | 'none';
  instructionsUrl?: string;
}

export interface AddonApiResponse {
  addons: Addon[];
  success: boolean;
  error?: string;
}
