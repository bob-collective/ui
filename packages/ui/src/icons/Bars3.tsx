import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Bars3 = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

Bars3.displayName = 'Bars3';

export { Bars3 };
