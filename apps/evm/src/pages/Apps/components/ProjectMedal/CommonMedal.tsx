import { Icon, IconProps } from '@gobob/ui';
import { forwardRef } from 'react';

const CommonMedal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 25 33' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M2 1.09375H23C23.8284 1.09375 24.5 1.76532 24.5 2.59375V21.865C24.5 22.3053 24.3066 22.7234 23.971 23.0084L13.471 31.9256C12.911 32.4012 12.089 32.4012 11.529 31.9256L1.02902 23.0084C0.69343 22.7234 0.5 22.3053 0.5 21.865V2.59375C0.5 1.76532 1.17157 1.09375 2 1.09375Z'
      fill='#313846'
      stroke='#4C5466'
    />
  </Icon>
));

CommonMedal.displayName = 'GoldMedal';

export { CommonMedal };
