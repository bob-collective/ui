import { DefaultTheme, css } from 'styled-components';

import { ResponsiveProp, Spacing, Typography } from '../../theme';

const getSpacingResponsiveCSS = (theme: DefaultTheme, attribute: string, prop?: ResponsiveProp<Spacing>) =>
  typeof prop === 'object'
    ? css`
        ${prop.base && theme.breakpoints.media.base`${attribute}: ${theme.spacing(prop.base)};`}
        ${prop.s && theme.breakpoints.media.s`${attribute}: ${theme.spacing(prop.s)};`}
    ${prop.md && theme.breakpoints.media.md`${attribute}: ${theme.spacing(prop.md)};`}
    ${prop.lg && theme.breakpoints.media.lg`${attribute}: ${theme.spacing(prop.lg)};`}
    ${prop.xl && theme.breakpoints.media.xl`${attribute}: ${theme.spacing(prop.xl)};`}
      `
    : prop && `${attribute}:${theme.spacing(prop)};`;

const getTypographyResponsiveCSS = (theme: DefaultTheme, prop?: ResponsiveProp<Typography>) =>
  typeof prop === 'object'
    ? css`
        ${prop.base && theme.breakpoints.media.base`${theme.typography(prop.base)}`}
        ${prop.s && theme.breakpoints.media.s`${theme.typography(prop.s)}`}
        ${prop.md && theme.breakpoints.media.md`${theme.typography(prop.md)}`}
        ${prop.lg && theme.breakpoints.media.lg`${theme.typography(prop.lg)}`}
        ${prop.xl && theme.breakpoints.media.xl`${theme.typography(prop.xl)}`}
      `
    : prop && theme.typography(prop);

const getResponsiveCSS = (
  theme: DefaultTheme,
  attribute: string,
  prop?: ResponsiveProp<string | number | boolean>,
  condition?: (prop: string | number | boolean) => string | number | boolean
) =>
  typeof prop === 'object'
    ? css`
        ${prop.base && theme.breakpoints.media.base`${attribute}: ${condition ? condition(prop.base) : prop.base};`}
        ${prop.s && theme.breakpoints.media.s`${attribute}: ${condition ? condition(prop.s) : prop.s};`}
    ${prop.md && theme.breakpoints.media.md`${attribute}: ${condition ? condition(prop.md) : prop.md};`}
    ${prop.lg && theme.breakpoints.media.lg`${attribute}: ${condition ? condition(prop.lg) : prop.lg};`}
    ${prop.xl && theme.breakpoints.media.xl`${attribute}: ${condition ? condition(prop.xl) : prop.xl};`}
      `
    : prop && `${attribute}:${condition ? condition(prop) : prop};`;

export { getResponsiveCSS, getSpacingResponsiveCSS, getTypographyResponsiveCSS };
