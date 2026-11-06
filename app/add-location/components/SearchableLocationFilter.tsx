'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/app/components/ui/command';

interface SearchableLocationFilterProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  testId: string;
}

export function SearchableLocationFilter({
  id, label, value, options, placeholder, disabled, onChange, testId,
}: SearchableLocationFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(option => option.value === value);
  const setExpanded = (expanded: boolean) => {
    setOpen(expanded);
    if (!expanded) setQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setExpanded}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? `${id}-options` : undefined}
          disabled={disabled}
          className="h-11 w-full justify-between gap-3 bg-gray-50 px-3 text-left font-normal text-gray-900 hover:bg-gray-100 focus-visible:ring-[#006d91]"
          data-testid={testId}
          onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setExpanded(true);
            } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
              event.preventDefault();
              setQuery(event.key);
              setOpen(true);
            }
          }}
        >
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden p-0 data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        <Command
          defaultValue={value}
          loop
          filter={(optionValue, search, keywords = []) => {
            const query = search.trim().toLocaleLowerCase('en');
            return [optionValue, ...keywords].some(text => text.toLocaleLowerCase('en').includes(query)) ? 1 : 0;
          }}
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={`Search ${label.toLowerCase()}…`}
            aria-label={`Search ${label.toLowerCase()}`}
            autoComplete="off"
            className="text-base md:text-sm"
            data-testid={`search-${testId.replace('select-', '')}`}
          />
          <CommandList
            id={`${id}-options`}
            aria-label={`${label} options`}
            className="max-h-[min(16rem,calc(var(--radix-popover-content-available-height)-3rem))] overscroll-contain"
          >
            <CommandEmpty>No matching {label.toLowerCase() === 'city' ? 'cities' : 'states'}.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  className="min-h-11 cursor-pointer"
                  onSelect={() => {
                    onChange(option.value);
                    setExpanded(false);
                  }}
                  data-testid={`option-${testId.replace('select-', '')}-${option.value}`}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && <Check className="h-4 w-4 text-gray-700" aria-hidden="true" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
