import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ChevronRight = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M8.25 4.5l7.5 7.5-7.5 7.5' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ChevronRight.displayName = 'ChevronRight';

export { ChevronRight };
