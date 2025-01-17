import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ChevronDoubleRight = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ChevronDoubleRight.displayName = 'ChevronDoubleRight';

export { ChevronDoubleRight };
