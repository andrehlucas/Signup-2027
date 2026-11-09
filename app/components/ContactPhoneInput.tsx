'use client';

import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import type { CountryCode, E164Number } from 'libphonenumber-js/max';
import { nationalPhone } from '../lib/phone';
import { formatPhoneEdit, formatPhoneEntry, type PhoneEntry } from '../lib/phone-entry';
import { Input } from './ui/input';

interface ContactPhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onInput'> {
  value: E164Number | undefined;
  country: CountryCode;
  onPhoneChange: (entry: PhoneEntry) => void;
}

export function ContactPhoneInput({ value, country, onPhoneChange, onBlur, ...props }: ContactPhoneInputProps) {
  const [text, setText] = useState(() => formatPhoneEntry(nationalPhone(value, country), country).text);
  const displayed = useRef(text);
  const emitted = useRef({ value, country });
  const lastEvent = useRef<Event | null>(null);
  const caretFrame = useRef<number | null>(null);

  useEffect(() => {
    if (emitted.current.value === value && emitted.current.country === country) return;
    emitted.current = { value, country };
    const formatted = formatPhoneEntry(nationalPhone(value, country), country).text;
    displayed.current = formatted;
    setText(formatted);
  }, [value, country]);

  useEffect(() => () => {
    if (caretFrame.current !== null) cancelAnimationFrame(caretFrame.current);
  }, []);

  const commit = (input: HTMLInputElement, native?: InputEvent) => {
    if (caretFrame.current !== null) cancelAnimationFrame(caretFrame.current);
    caretFrame.current = null;
    const raw = input.value;
    // Autofill may have no character data, inputType or usable selection.
    // Only ordinary single-character edits need optional caret restoration.
    const ordinaryEdit = native && !native.isComposing &&
      ((native.inputType === 'insertText' && native.data?.length === 1) ||
        native.inputType === 'deleteContentBackward' || native.inputType === 'deleteContentForward');
    const selection = ordinaryEdit ? input.selectionStart : null;
    // Safari can send input and change for one fill before React commits
    // the new country. Use the most recently emitted pair, not stale props.
    const activeCountry = emitted.current.country;
    const next = formatPhoneEdit(raw, displayed.current, activeCountry, native?.inputType || '', selection);
    // Also normalize same-number refills: React may otherwise skip a render
    // because the resulting state is unchanged while the DOM was autofilled.
    input.value = next.text;
    displayed.current = next.text;
    setText(next.text);
    const changed = next.value !== emitted.current.value || next.country !== emitted.current.country;
    emitted.current = { value: next.value, country: next.country };
    if (changed) onPhoneChange(next);

    if (ordinaryEdit && typeof selection === 'number' && next.caret !== undefined &&
      next.country === activeCountry && !/^\s*(\+|00)/.test(raw)) {
      caretFrame.current = requestAnimationFrame(() => {
        caretFrame.current = null;
        if (!input.isConnected || document.activeElement !== input || input.value !== next.text) return;
        try {
          input.setSelectionRange(next.caret!, next.caret!);
        } catch (error) {
          // Selection is presentation-only; some autofill/keyboard states
          // temporarily reject it even on a native tel input.
          if (!(error instanceof DOMException) ||
            !['InvalidStateError', 'NotSupportedError'].includes(error.name)) throw error;
        }
      });
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    // Listen to native input as well as change, so autofill that bypasses
    // React's value tracker still reaches the same formatting path.
    if (lastEvent.current === event.nativeEvent) return;
    lastEvent.current = event.nativeEvent;
    const native = event.nativeEvent as InputEvent;
    if (native.isComposing) {
      displayed.current = event.currentTarget.value;
      setText(event.currentTarget.value);
      return;
    }
    commit(event.currentTarget, native);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    // Recover browser/extension fills that changed the DOM without input.
    commit(event.currentTarget);
    onBlur?.(event);
  };

  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      value={text}
      onInput={handleInput}
      onChange={handleInput}
      onCompositionEnd={event => commit(event.currentTarget)}
      onBlur={handleBlur}
    />
  );
}
