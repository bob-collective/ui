import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const ArrowTopRightOnSquare = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
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
      d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
));

ArrowTopRightOnSquare.displayName = 'ArrowTopRightOnSquare';

export { ArrowTopRightOnSquare };
