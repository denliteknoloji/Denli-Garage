// GG.AA.YYYY maskeli tarih alanı. Dışarıya ISO tarih (veya null) verir.
import { useState } from 'react';

import { formatTR, maskDate, parseTR } from '@/lib/dates';

import { Field } from './ui';

export function DateField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (iso: string | null) => void;
  hint?: string;
}) {
  const [text, setText] = useState(formatTR(value));
  const complete = text.length === 10;
  const invalid = complete && !parseTR(text);

  return (
    <Field
      label={label}
      value={text}
      placeholder="GG.AA.YYYY"
      keyboardType="number-pad"
      maxLength={10}
      hint={hint}
      error={invalid ? 'Geçerli bir tarih yaz (örnek: 15.03.2027)' : null}
      onChangeText={(t) => {
        const masked = maskDate(t);
        setText(masked);
        onChange(masked.length === 10 ? parseTR(masked) : masked.length === 0 ? null : value);
      }}
    />
  );
}
