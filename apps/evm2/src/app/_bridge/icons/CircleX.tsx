import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const CircleX = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} fill='none' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_1885_710)'>
      <path
        d='M6 1C3.235 1 1 3.235 1 6C1 8.765 3.235 11 6 11C8.765 11 11 8.765 11 6C11 3.235 8.765 1 6 1ZM8.5 7.795L7.795 8.5L6 6.705L4.205 8.5L3.5 7.795L5.295 6L3.5 4.205L4.205 3.5L6 5.295L7.795 3.5L8.5 4.205L6.705 6L8.5 7.795Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_1885_710'>
        <rect fill='white' height='12' width='12' />
      </clipPath>
    </defs>
  </Icon>
));

CircleX.displayName = 'CircleX';

export { CircleX };
