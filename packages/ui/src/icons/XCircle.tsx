import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const XCircle = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

XCircle.displayName = 'XCircle';

export { XCircle };
