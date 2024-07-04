import { defineTheme } from '../../define';

import { accordion } from './accordion';
import { alert } from './alert';
import { button } from './button';
import { card } from './card';
import { colors } from './colors';
import { dialog } from './dialog';
import { divider } from './divider';
import { drawer } from './drawer';
import { input } from './input';
import { label } from './label';
import { list } from './list';
import { progressBar } from './progress-bar';
import { radio } from './radio';
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
  dialog,
  divider,
  drawer,
  input,
  list,
  radio,
  spinner,
  switch: _switch,
  progressBar,
  tooltip,
  tokenInput,
  table,
  tabs,
  stepper,
  label
});

export { bobTheme };
