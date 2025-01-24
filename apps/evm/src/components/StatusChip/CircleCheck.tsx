import { Icon, IconProps } from '@gobob/ui';
import { forwardRef } from 'react';

const CircleCheck = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} fill='none' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_721_4026)'>
      <path
        d='M7.00008 1.16675C3.78008 1.16675 1.16675 3.78008 1.16675 7.00008C1.16675 10.2201 3.78008 12.8334 7.00008 12.8334C10.2201 12.8334 12.8334 10.2201 12.8334 7.00008C12.8334 3.78008 10.2201 1.16675 7.00008 1.16675ZM5.83342 9.91675L2.91675 7.00008L3.73925 6.17758L5.83342 8.26592L10.2609 3.83841L11.0834 4.66675L5.83342 9.91675Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_721_4026'>
        <rect fill='white' height='14' width='14' />
      </clipPath>
    </defs>
  </Icon>
));

CircleCheck.displayName = 'CircleCheck';

export { CircleCheck };
