import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const FBTC = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 19 26' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g id='Group 1000005127'>
      <g id='Group 1000005122'>
        <g id='Group 1000005123'>
          <path
            clipRule='evenodd'
            d='M15.1715 11.3193C15.1715 14.6115 12.5073 17.2803 9.22091 17.2803C5.93449 17.2803 3.27032 14.6115 3.27032 11.3193C3.27032 6.26915 9.07382 0 9.22091 0C9.368 0 15.1715 6.26915 15.1715 11.3193ZM12.7645 11.3199C12.7645 13.2804 11.1779 14.8697 9.22085 14.8697C7.26377 14.8697 5.67724 13.2804 5.67724 11.3199C5.67724 9.37778 7.23411 7.79994 9.1658 7.77047V11.4292C9.1658 11.4292 11.4109 10.5283 12.5074 9.99008C12.6732 10.4008 12.7645 10.8497 12.7645 11.3199Z'
            fill='url(#paint0_linear_5712_9817)'
            fillRule='evenodd'
            id='Union'
          />
          <path
            d='M7.88465 20.8015L17.5227 19.768C17.6348 20.823 17.6083 21.8911 17.4426 22.9401L7.84506 22.3445C7.92606 21.8331 7.93979 21.3146 7.88465 20.8015Z'
            fill='url(#paint1_linear_5712_9817)'
            id='Vector'
          />
          <path
            d='M10.4109 17.9812L0.907334 19.892C1.1163 20.9321 1.46149 21.943 1.93368 22.8939L10.9107 19.4412C10.6803 18.9777 10.5119 18.4872 10.4109 17.9812Z'
            fill='url(#paint2_linear_5712_9817)'
            id='Vector_2'
          />
        </g>
      </g>
    </g>
    <defs>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint0_linear_5712_9817'
        x1='9.15148'
        x2='9.28563'
        y1='0.358433'
        y2='17.1782'
      >
        <stop stopColor='#FF05FF' />
        <stop offset='0.56' stopColor='#8323FF' />
        <stop offset='0.76' stopColor='#8F00FF' />
        <stop offset='0.985' stopColor='#4E68FF' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint1_linear_5712_9817'
        x1='19.4997'
        x2='9.74626'
        y1='19.4999'
        y2='22.2729'
      >
        <stop stopColor='#DFB6FF' />
        <stop offset='0.49109' stopColor='#8F00FF' />
        <stop offset='0.995' stopColor='#5263FF' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint2_linear_5712_9817'
        x1='9.74978'
        x2='-0.92694'
        y1='19.4998'
        y2='20.4469'
      >
        <stop offset='0.015' stopColor='#5066FF' />
        <stop offset='0.538411' stopColor='#8F00FF' />
        <stop offset='1' stopColor='#DFB6FF' />
      </linearGradient>
    </defs>
  </Icon>
));

FBTC.displayName = 'FBTC';

export { FBTC };
