export const acceptableEndReasons = [
  { label: 'Lost contact', value: 'LOST_CONTACT' },
  { label: 'Adoptee transferred facilities', value: 'TRANSFERRED_FACILITIES' },
  { label: 'Adoptee was released', value: 'RELEASED' },
  { label: 'Mutual agreement', value: 'MUTUAL_AGREEMENT' },
  { label: 'Problematic behavior from adoptee', value: 'PROBLEMATIC_BEHAVIOR' },
  { label: 'Personal circumstances', value: 'PERSONAL_CIRCUMSTANCES' },
];

export const unacceptableEndReasons = [
  { label: 'Lost interest in adoptee', value: 'LOST_INTEREST' },
  {
    label: 'Looking for a different type of connection',
    value: 'LOOKING_FOR_DIFFERENT_CONNECTION',
  },
];

export const endReasons = acceptableEndReasons.concat(unacceptableEndReasons);
