import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowDown = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ArrowDown.displayName = 'ArrowDown';

export { ArrowDown };
