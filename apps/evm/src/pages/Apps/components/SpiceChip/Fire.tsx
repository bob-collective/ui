import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';
import { useTheme } from 'styled-components';

type Props = {
  isLit?: boolean;
};

type InheritAttrs = Omit<IconProps, keyof Props>;

type FireProps = Props & InheritAttrs;

const Fire = forwardRef<SVGSVGElement, FireProps>(({ isLit, fill, ...props }, ref) => {
  const theme = useTheme();

  const litColor = isLit ? theme.color('primary-500') : theme.color('grey-50');

  return (
    <Icon {...props} ref={ref} strokeWidth='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z'
        fill={litColor}
        stroke={litColor}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z'
        fill={fill}
        stroke={fill}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Icon>
  );
});

Fire.displayName = 'Fire';

export { Fire };
