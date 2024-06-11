import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const TrustWallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect fill='white' height='48' rx='8' width='48' />
    <path d='M10.2222 12.978L24 8.5V39.5C14.1586 35.3663 10.2222 27.4441 10.2222 22.967V12.978Z' fill='#0500FF' />
    <path
      d='M37.7778 12.978L24 8.5V39.5C33.8414 35.3663 37.7778 27.4441 37.7778 22.967V12.978Z'
      fill='url(#paint0_linear_1328_1094)'
    />
    <defs>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint0_linear_1328_1094'
        x1='34.118'
        x2='23.7105'
        y1='6.32918'
        y2='39.0767'
      >
        <stop offset='0.02' stopColor='#0000FF' />
        <stop offset='0.08' stopColor='#0094FF' />
        <stop offset='0.16' stopColor='#48FF91' />
        <stop offset='0.42' stopColor='#0094FF' />
        <stop offset='0.68' stopColor='#0038FF' />
        <stop offset='0.9' stopColor='#0500FF' />
      </linearGradient>
    </defs>
  </Icon>
));

TrustWallet.displayName = 'TrustWallet';

export { TrustWallet };
