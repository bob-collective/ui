type FontWeightBase = 'normal' | 'medium' | 'semibold' | 'bold';

type FontWeightNative = 'inherit' | 'unset';

type FontWeight = FontWeightBase | FontWeightNative;

const fontWeightBase = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};

const fontWeight = (key: FontWeight) => fontWeightBase[key as FontWeightBase] || key;

export { fontWeight };
export type { FontWeight };
