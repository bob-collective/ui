import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowUp = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

ArrowUp.displayName = 'ArrowUp';

export { ArrowUp };
