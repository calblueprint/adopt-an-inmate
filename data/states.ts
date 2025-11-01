import states from 'states-us';

export const statesOnly = states.filter(st => !st.territory);

export const statesDropdownOptions = statesOnly.map(st => ({
  label: st.name,
  value: st.name.toLowerCase(),
}));
