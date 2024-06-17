import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ChevronLeft = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M15.75 19.5 8.25 12l7.5-7.5' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ChevronLeft.displayName = 'ChevronLeft';

export { ChevronLeft };
