import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowRightLeft = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

ArrowRightLeft.displayName = 'ArrowRightLeft';

export { ArrowRightLeft };
