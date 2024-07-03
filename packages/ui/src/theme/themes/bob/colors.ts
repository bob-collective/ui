import {
  Palette,
  GreyColors,
  PrimaryColors,
  color as baseColor,
  BlueColors,
  GreenColors,
  RedColors,
  VioletColors,
  YellowColors
} from '../../core';

const primary: PrimaryColors = {
  'primary-50': '#ffefe6',
  'primary-100': '#ffcfb0',
  'primary-200': '#ffb78a',
  'primary-300': '#ff9655',
  /// keep these
  'primary-400': '#F79254',
  'primary-500': '#F35D00',
  'primary-600': '#DD5500',
  ///
  'primary-700': '#b54601',
  'primary-800': '#8c3601',
  'primary-900': '#6b2a00'
};

const grey: GreyColors = {
  'grey-50': '#9DAAC6',
  'grey-100': '#677186',
  'grey-200': '#4C5466',
  'grey-300': '#313846',
  'grey-400': '#161B26',
  'grey-500': '#12161E',
  'grey-600': '#0D1017',
  'grey-700': '#090B0F',
  'grey-800': '#07080B',
  'grey-900': '#050608'
};

const violet: VioletColors = {
  'violet-400': '#161B26',
  'violet-500': '#12161E',
  'violet-600': '#0D1017'
};

const blue: BlueColors = {
  'blue-50': '#D7D7D7',
  'blue-100': '#CDE3FE',
  'blue-200': '#99C7FB',
  'blue-300': '#66AAF9',
  'blue-400': '#338EF7',
  'blue-500': '#016FEE',
  'blue-600': '#005CC4',
  'blue-700': '#004493',
  'blue-800': '#012E62',
  'blue-900': '#011731'
};

const green: GreenColors = {
  'green-50': '#E8FAF1',
  'green-100': '#D1F4E0',
  'green-200': '#A2E9C1',
  'green-300': '#74DFA2',
  'green-400': '#45D483',
  'green-500': '#18C964',
  'green-600': '#12A150',
  'green-700': '#10793C',
  'green-800': '#0A5028',
  'green-900': '#042814'
};

const red: RedColors = {
  'red-50': '#FEE7EF',
  'red-100': '#FDD1DF',
  'red-200': '#FAA0BF',
  'red-300': '#F871A0',
  'red-400': '#F54280',
  'red-500': '#F31261',
  'red-600': '#C62155',
  'red-700': '#920B3A',
  'red-800': '#610827',
  'red-900': '#310413'
};

const yellow: YellowColors = {
  'yellow-50': '#FEFCE8',
  'yellow-100': '#FDEDD3',
  'yellow-200': '#FBDCA7',
  'yellow-300': '#F9C97D',
  'yellow-400': '#F8B750',
  'yellow-500': '#F5A524',
  'yellow-600': '#C5841E',
  'yellow-700': '#946316',
  'yellow-800': '#62420E',
  'yellow-900': '#312106'
};

const colors: Palette = {
  light: '#ffffff',
  dark: '#030303',
  ...primary,
  ...grey,
  ...violet,
  ...blue,
  ...green,
  ...red,
  ...yellow
};

const color = baseColor(colors);

export { color, colors };
