'use client';

import { useEffect, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Grid } from '@astryxdesign/core/Grid';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea';
import { Selector } from '@astryxdesign/core/Selector';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
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
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
      purpose="form"
      width={448}
      maxHeight="calc(100dvh - 2rem)"
      data-testid="review-phone-dialog"
    >
      <VStack gap={4}>
        <DialogHeader
          title="Choose your business number"
          subtitle={`Choose an available local phone number for ${city}.`}
          onOpenChange={onOpenChange}
        />

        <VStack gap={2}>
          <Selector
            label="Area code"
            options={[{ value: 'all', label: 'All area codes' }, ...areaCodes]}
            value={areaCode}
            onChange={setAreaCode}
            data-testid="select-business-area-code"
          />
          <Text type="supporting" color="secondary" aria-live="polite" data-testid="phone-options-count">
            {filtered.length} {filtered.length === 1 ? 'number' : 'numbers'} available
          </Text>
        </VStack>

        <ScrollableArea label="Available local phone numbers" overscroll="contain" className="max-h-[min(20rem,28dvh)]" data-testid="business-phone-options">
          {filtered.length > 0 ? (
            <RadioList
              label="Available local phone numbers"
              isLabelHidden
              htmlName="review-business-phone"
              value={draftId}
              onChange={setDraftId}
            >
              {filtered.map(number => (
                <RadioListItem
                  key={number.id}
                  value={number.id}
                  label={<Text hasTabularNumbers weight="medium">{number.number}</Text>}
                  aria-label={number.number}
                  endContent={selected?.id === number.id ? <Text type="supporting" color="secondary">Current</Text> : undefined}
                  data-testid={`review-phone-option-${number.id}`}
                />
              ))}
            </RadioList>
          ) : (
            <Text color="secondary">No local phone numbers are currently available for this area code.</Text>
          )}
        </ScrollableArea>

        <Text type="supporting" color="secondary">Sample phone options for this prototype.</Text>

        <Grid columns={2} gap={2}>
          <Button
            type="button"
            variant="secondary"
            label="Cancel"
            width="100%"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-review-phone"
          />
          <Button
            type="button"
            variant="primary"
            label="Save number"
            width="100%"
            isDisabled={!candidate}
            onClick={() => {
              if (!candidate) return;
              onSave(candidate);
              onOpenChange(false);
            }}
            data-testid="button-save-review-phone"
          />
        </Grid>
      </VStack>
    </Dialog>
  );
}
