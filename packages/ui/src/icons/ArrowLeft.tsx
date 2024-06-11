import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowLeft = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ArrowLeft.displayName = 'ArrowLeft';

export { ArrowLeft };
