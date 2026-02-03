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
import { Label } from '@/app/components/ui/label';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  availableNumbers: string[];
  selectedNumber?: string | null;
  onSave: (selectedNumber: string) => void;
}

export function PhoneNumberModal({
  isOpen,
  onClose,
  title,
  availableNumbers,
  selectedNumber: initialSelectedNumber = null,
  onSave,
}: PhoneNumberModalProps) {
  const [selectedNumber, setSelectedNumber] = useState<string>(
    initialSelectedNumber || ''
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedNumber(initialSelectedNumber || '');
    }
  }, [isOpen, initialSelectedNumber]);

  const handleSave = () => {
    if (selectedNumber) {
      onSave(selectedNumber);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-phone-number">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a phone number from the available options:
          </p>
          {availableNumbers.length > 0 ? (
            <RadioGroup
              value={selectedNumber}
              onValueChange={setSelectedNumber}
              className="space-y-3"
            >
              {availableNumbers.map((number, index) => (
                <div key={number} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={number} 
                    id={`phone-${index}`} 
                    data-testid={`radio-phone-${index}`} 
                  />
                  <Label htmlFor={`phone-${index}`} className="cursor-pointer font-mono">
                    {number}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No phone numbers are currently available. Please contact support.
            </p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedNumber}
            data-testid="button-save"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
