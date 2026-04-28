export const acceptableEndReasons = [
  { label: 'Lost contact', value: 'LOST_CONTACT' },
  { label: 'Adoptee transferred facilities', value: 'TRANSFERRED_FACILITIES' },
  { label: 'Adoptee was released', value: 'RELEASED' },
  { label: 'Mutual agreement', value: 'MUTUAL_AGREEMENT' },
  { label: 'Problematic behavior from adoptee', value: 'PROBLEMATIC_BEHAVIOR' },
  { label: 'Personal circumstances', value: 'PERSONAL_CIRCUMSTANCES' },
] as const;

export const unacceptableEndReasons = [
  { label: 'Lost interest in adoptee', value: 'LOST_INTEREST' },
  {
    label: 'Looking for a different type of connection',
    value: 'LOOKING_FOR_DIFFERENT_CONNECTION',
  },
] as const;

const endReasonStatic = [
  ...acceptableEndReasons,
  ...unacceptableEndReasons,
] as const;

export const endReasons = endReasonStatic.toSorted((a, b) =>
  a.label.localeCompare(b.label),
);

export type EndReasonOption = (typeof endReasonStatic)[number];
export type EndReason = (typeof endReasonStatic)[number]['value'];
