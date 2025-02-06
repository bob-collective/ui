import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const TRB = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg' {...props}>
    <defs>
      <clipPath id='clip-path'>
        <rect height='200' style={{ fill: 'none' }} width='200' />
      </clipPath>
      <linearGradient
        gradientTransform='translate(0 -798)'
        gradientUnits='userSpaceOnUse'
        id='linear-gradient'
        x1='88.62'
        x2='104.7'
        y1='867.19'
        y2='929.41'
      >
        <stop offset='0' stopColor='#00ff8f' />
        <stop offset='0.43' stopColor='#53fdb2' />
        <stop offset='1' stopColor='#68fcbb' />
      </linearGradient>
    </defs>
    <title>tellor-trb</title>
    <g data-name='Layer 2' id='Layer_2'>
      <g data-name='Layer 1' id='Layer_1-2'>
        <g style={{ clipPath: 'url(#clip-path)' }}>
          <circle cx='100' cy='100' r='100' />
          <path
            d='M164.8,77.5c4.4,17.2-82.3,59.7-121.6,69.8s76-39.7,71.5-56.9S18.3,87.3,57.6,77.2,160.4,60.3,164.8,77.5Z'
            style={{ fill: 'url(#linear-gradient)' }}
          />
        </g>
      </g>
    </g>
  </Icon>
));

TRB.displayName = 'TRB';

export { TRB };
