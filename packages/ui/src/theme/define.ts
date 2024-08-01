import type { Palette } from './core';

import {
  AccordionTheme,
  AlertTheme,
  ButtonTheme,
  CardTheme,
  ChipTheme,
  DialogTheme,
  DividerTheme,
  DrawerTheme,
  HelperTextTheme,
  InputTheme,
  LabelTheme,
  LinkTheme,
  ListTheme,
  ProgressBarTheme,
  RadioTheme,
  SelectTheme,
  SpinnerTheme,
  StepperTheme,
  SwitchTheme,
  TableTheme,
  TabsTheme,
  TokenInputTheme,
  TooltipTheme
} from './components';
import {
  breakpoints,
  color,
  fontSize,
  fontWeight,
  icon,
  lineHeight,
  maxWidth,
  rounded,
  spacing,
  transition,
  typography
} from './core';

const baseTheme = {
  fontSize,
  fontWeight,
  lineHeight,
  rounded,
  spacing,
  typography,
  transition,
  maxWidth,
  breakpoints
};

type ThemeParams = {
  colors: Palette;
  accordion: AccordionTheme;
  alert: AlertTheme;
  button: ButtonTheme;
  card: CardTheme;
  chip: ChipTheme;
  dialog: DialogTheme;
  divider: DividerTheme;
  drawer: DrawerTheme;
  input: InputTheme;
  link: LinkTheme;
  list: ListTheme;
  radio: RadioTheme;
  switch: SwitchTheme;
  select: SelectTheme;
  spinner: SpinnerTheme;
  progressBar: ProgressBarTheme;
  tooltip: TooltipTheme;
  tokenInput: TokenInputTheme;
  tabs: TabsTheme;
  table: TableTheme;
  stepper: StepperTheme;
  label: LabelTheme;
  helperText: HelperTextTheme;
};

const defineTheme = ({ colors, ...theme }: ThemeParams) => ({
  ...baseTheme,
  ...theme,
  icon: icon(colors),
  color: color(colors)
});

type Theme = ReturnType<typeof defineTheme>;

export { defineTheme };
export type { Theme };
