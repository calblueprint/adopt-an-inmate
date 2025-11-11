const parseEmail = (email: string) => {
  return { email, text: email };
};

const parseDropdown = (dropdownIds: string[]) => {
  return dropdownIds.join(',');
};

const parseLocation = (address: string) => {
  return {
    lat: '29.9772962',
    lng: '31.1324955',
    address,
  };
};

export const parseMondayValue = (value: string, type: string) => {
  if (type === 'dropdown') return parseDropdown([value]);
  else if (type === 'email') return parseEmail(value);
  else if (type === 'location') return parseLocation(value);
  return value;
};
