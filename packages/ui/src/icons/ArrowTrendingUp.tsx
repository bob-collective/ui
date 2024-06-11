import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowTrendingUp = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
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
      d='M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

ArrowTrendingUp.displayName = 'ArrowTrendingUp';

export { ArrowTrendingUp };
