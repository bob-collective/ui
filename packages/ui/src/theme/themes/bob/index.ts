import { defineTheme } from '../../define';

import { accordion } from './accordion';
import { alert } from './alert';
import { button } from './button';
import { card } from './card';
import { chip } from './chip';
import { colors } from './colors';
import { dialog } from './dialog';
import { divider } from './divider';
import { drawer } from './drawer';
import { helperText } from './helper-text';
import { input } from './input';
import { label } from './label';
import { link } from './link';
import { list } from './list';
import { progressBar } from './progress-bar';
import { radio } from './radio';
import { scroll } from './scroll';
import { select } from './select';
import { skeleton } from './skeleton';
import { spinner } from './spinner';
import { stepper } from './stepper';
import { _switch } from './switch';
import { table } from './table';
import { tabs } from './tabs';
import { tokenInput } from './token-input';
import { tooltip } from './tooltip';

const bobTheme = defineTheme({
  colors,
  accordion,
  alert,
  button,
  card,
  chip,
  dialog,
  divider,
  drawer,
  input,
  link,
  list,
  radio,
  spinner,
  switch: _switch,
  progressBar,
  tooltip,
  tokenInput,
  table,
  tabs,
  scroll,
  skeleton,
  select,
  stepper,
  label,
  helperText
});

export { bobTheme };
