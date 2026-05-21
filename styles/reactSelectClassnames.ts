import { ClassNamesConfig } from 'react-select';
import { cn } from '@/lib/utils';

export const reactSelectClassnames: ClassNamesConfig = {
  control: () =>
    'bg-input px-3 py-1 rounded-lg ring-gray-9 focus-within:ring-1',
  indicatorSeparator: () => 'hidden',
  valueContainer: () => 'bg-input',
  dropdownIndicator: () => 'bg-input text-gray-9',
  placeholder: () => 'text-gray-9',
  menu: () => 'rounded-lg p-2 bg-white shadow-sm mt-2',
  menuList: () => 'p-1',
  option: ({ isSelected, isFocused }) =>
    cn(
      'rounded-md text-black/60! transition-colors px-3 py-2',
      isSelected && 'bg-gray-3',
      !isSelected && isFocused && 'bg-gray-2',
    ),
};
