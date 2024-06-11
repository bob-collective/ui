import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Bolt = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
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
      d='m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

Bolt.displayName = 'Bolt';

export { Bolt };
