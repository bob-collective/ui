import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowDownCircle = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
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
      d='m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

ArrowDownCircle.displayName = 'ArrowDownCircle';

export { ArrowDownCircle };
