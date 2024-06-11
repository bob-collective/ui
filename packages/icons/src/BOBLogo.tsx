import { forwardRef, useMemo } from 'react';
import { Icon, IconProps } from '@gobob/ui';
import { useTheme } from 'styled-components';

type BOBColors = 'light' | 'dark' | 'primary';

type BobLogoProps = Omit<IconProps, 'color'> & { color?: BOBColors };

const BOBLogo = forwardRef<SVGSVGElement, BobLogoProps>(({ color = 'primary', ...props }, ref) => {
  const theme = useTheme();

  const { bg, fill } = useMemo(
    () =>
      ({
        primary: {
          bg: theme.color('primary-500'),
          fill: theme.color('light')
        },
        dark: {
          bg: theme.color('dark'),
          fill: theme.color('light')
        },
        light: {
          bg: theme.color('light'),
          fill: theme.color('dark')
        }
      })[color],
    [theme, color]
  );

  return (
    <Icon ref={ref} fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
      <circle cx='12' cy='12' fill={bg} r='12' />
      <rect fill={fill} height='4' rx='1' width='4' x='7' y='5' />
      <rect fill={fill} height='4' rx='1' width='4' x='7' y='10' />
      <rect fill={fill} height='4' rx='1' width='4' x='7' y='15' />
      <rect fill={fill} height='4' rx='1' width='4' x='12' y='15' />
      <rect fill={fill} height='4' rx='1' width='4' x='12' y='10' />
    </Icon>
  );
});

BOBLogo.displayName = 'BOBLogo';

export { BOBLogo };
