'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';

interface SupervisedTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: boolean;
  onSave: (availableForCalls: boolean) => void;
}

export function SupervisedTransferModal({
  isOpen,
  onClose,
  initialValue = false,
  onSave,
}: SupervisedTransferModalProps) {
  const [availableForCalls, setAvailableForCalls] = useState<string>(
    initialValue ? 'yes' : 'no'
  );

  const handleSave = () => {
    onSave(availableForCalls === 'yes');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-supervised-transfer">
        <DialogHeader>
          <DialogTitle>Supervised Transfer Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you available for receiving incoming calls?
          </p>
          <RadioGroup
            value={availableForCalls}
            onValueChange={setAvailableForCalls}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="available-yes" data-testid="radio-available-yes" />
              <Label htmlFor="available-yes" className="cursor-pointer">
                Yes, I am available for incoming calls
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="available-no" data-testid="radio-available-no" />
              <Label htmlFor="available-no" className="cursor-pointer">
                No, I am not available for incoming calls
              </Label>
            </div>
          </RadioGroup>
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
