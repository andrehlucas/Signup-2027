'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import type { PhoneNumber } from '../types';

interface LocalPhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numbers: PhoneNumber[];
  selected: PhoneNumber | null;
  city: string;
  onSave: (number: PhoneNumber) => void;
}

export function LocalPhoneNumberDialog({ open, onOpenChange, numbers, selected, city, onSave }: LocalPhoneNumberDialogProps) {
  const [draftId, setDraftId] = useState(selected?.id || '');

  useEffect(() => {
    if (open) setDraftId(selected?.id || '');
  }, [open, selected?.id]);

  const candidate = numbers.find(number => number.id === draftId && number.isAvailable);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-md" data-testid="review-phone-dialog">
        <DialogHeader>
          <DialogTitle>Choose your business number</DialogTitle>
          <DialogDescription>Choose an available local phone number for {city}.</DialogDescription>
        </DialogHeader>
        <fieldset className="min-w-0 space-y-2">
          <legend className="sr-only">Available local phone numbers</legend>
          {numbers.filter(number => number.isAvailable).map(number => (
            <label
              key={number.id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium text-gray-900 ${draftId === number.id ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name="review-business-phone"
                value={number.id}
                checked={draftId === number.id}
                onChange={() => setDraftId(number.id)}
                className="h-4 w-4 accent-[#006d91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006d91]"
                data-testid={`review-phone-option-${number.id}`}
              />
              <span className="tabular-nums">{number.number}</span>
              {selected?.id === number.id && <span className="ml-auto text-xs font-normal text-gray-600">Current</span>}
            </label>
          ))}
          {numbers.length === 0 && <p className="text-sm text-gray-600">No local phone numbers are currently available.</p>}
        </fieldset>
        <DialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-review-phone"
          >Cancel</Button>
          <Button
            type="button"
            className="signup-primary min-h-11 w-full"
            disabled={!candidate}
            onClick={() => {
              if (!candidate) return;
              onSave(candidate);
              onOpenChange(false);
            }}
            data-testid="button-save-review-phone"
          >Save number</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
