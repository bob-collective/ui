import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowPath = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
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
      d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

ArrowPath.displayName = 'ArrowPath';

export { ArrowPath };
