'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { DeliveryMethod } from './types';

interface MessageTakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDeliveryMethod?: DeliveryMethod;
  initialTermsAccepted?: boolean;
  onSave: (deliveryMethod: DeliveryMethod, termsAccepted: boolean) => void;
}

export function MessageTakingModal({
  isOpen,
  onClose,
  initialDeliveryMethod = 'email',
  initialTermsAccepted = false,
  onSave,
}: MessageTakingModalProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(initialDeliveryMethod);
  const [termsAccepted, setTermsAccepted] = useState(initialTermsAccepted);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDeliveryMethod(initialDeliveryMethod);
      setTermsAccepted(initialTermsAccepted);
      setShowError(false);
    }
  }, [isOpen, initialDeliveryMethod, initialTermsAccepted]);

  const handleSave = () => {
    if (!termsAccepted) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSave(deliveryMethod, termsAccepted);
    onClose();
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      setShowError(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-message-taking">
        <DialogHeader>
          <DialogTitle>Message Taking Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              How would you like your messages to be delivered?
            </p>
            <RadioGroup
              value={deliveryMethod}
              onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="email" id="delivery-email" data-testid="radio-delivery-email" />
                <Label htmlFor="delivery-email" className="cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="sms" id="delivery-sms" data-testid="radio-delivery-sms" />
                <Label htmlFor="delivery-sms" className="cursor-pointer">
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="both" id="delivery-both" data-testid="radio-delivery-both" />
                <Label htmlFor="delivery-both" className="cursor-pointer">
                  Both (Email & SMS)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-accepted"
                checked={termsAccepted}
                onCheckedChange={handleTermsChange}
                data-testid="checkbox-terms"
              />
              <Label
                htmlFor="terms-accepted"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I authorize you to send me my messages according to the{' '}
                <a
                  href="https://www.opusvirtualoffices.com/opus-virtual-offices-terms-of-use/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#36bff9] hover:underline"
                  data-testid="link-terms"
                >
                  terms and conditions
                </a>
              </Label>
            </div>
            {showError && (
              <p className="text-sm text-red-500" data-testid="text-error-terms">
                You must accept the terms and conditions to continue.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
