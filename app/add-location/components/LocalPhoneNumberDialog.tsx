'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  const [areaCode, setAreaCode] = useState('all');

  useEffect(() => {
    if (open) {
      setDraftId(selected?.id || '');
      setAreaCode('all');
    }
  }, [open, selected?.id]);

  const available = numbers.filter(number => number.isAvailable);
  const areaCodes = [...new Set(available.map(number => number.areaCode))].sort();
  const filtered = available.filter(number => areaCode === 'all' || number.areaCode === areaCode);
  const candidate = filtered.find(number => number.id === draftId);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden sm:max-w-md" data-testid="review-phone-dialog">
        <DialogHeader className="shrink-0">
          <DialogTitle>Choose your business number</DialogTitle>
          <DialogDescription>Choose an available local phone number for {city}.</DialogDescription>
        </DialogHeader>
        <div className="shrink-0 space-y-2">
          <label htmlFor="business-phone-area-code" className="block text-sm font-medium text-gray-700">Area code</label>
          <div className="relative">
            <select
              id="business-phone-area-code"
              value={areaCode}
              onChange={event => setAreaCode(event.target.value)}
              className="h-11 w-full appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006d91] sm:text-sm"
              data-testid="select-business-area-code"
            >
              <option value="all">All area codes</option>
              {areaCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          </div>
          <p className="text-xs text-gray-600" aria-live="polite" data-testid="phone-options-count">
            {filtered.length} {filtered.length === 1 ? 'number' : 'numbers'} available
          </p>
        </div>
        <div role="radiogroup" aria-label="Available local phone numbers" className="max-h-80 min-h-0 min-w-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-1" data-testid="business-phone-options">
          {filtered.map(number => (
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
          {filtered.length === 0 && <p className="text-sm text-gray-600">No local phone numbers are currently available for this area code.</p>}
        </div>
        <p className="shrink-0 text-xs text-gray-500">Sample phone options for this prototype.</p>
        <DialogFooter className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:space-x-0">
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
