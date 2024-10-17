import { Icon, IconProps } from '@gobob/ui';
import { forwardRef } from 'react';

const GoldMedal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 25 33' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M2 1.09375H23C23.8284 1.09375 24.5 1.76532 24.5 2.59375V21.865C24.5 22.3053 24.3066 22.7234 23.971 23.0084L13.471 31.9256C12.911 32.4012 12.089 32.4012 11.529 31.9256L1.02902 23.0084C0.69343 22.7234 0.5 22.3053 0.5 21.865V2.59375C0.5 1.76532 1.17157 1.09375 2 1.09375Z'
      fill='url(#paint0_linear_1566_1130)'
      stroke='url(#paint1_linear_1566_1130)'
    />
    <defs>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint0_linear_1566_1130'
        x1='12.5'
        x2='12.5'
        y1='0.59375'
        y2='33.4062'
      >
        <stop offset='0.184524' stopColor='#FFC46B' />
        <stop offset='0.422619' stopColor='#FFF4D1' />
        <stop offset='0.583333' stopColor='#FFBF5E' />
        <stop offset='0.935' stopColor='#FFDFA0' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint1_linear_1566_1130'
        x1='12.5'
        x2='12.5'
        y1='0.59375'
        y2='33.4062'
      >
        <stop stopColor='#2A2A2A' />
        <stop offset='0.505' stopColor='#FFECC7' />
      </linearGradient>
    </defs>
  </Icon>
));

GoldMedal.displayName = 'GoldMedal';

export { GoldMedal };
