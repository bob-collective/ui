import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const LBTC = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 280 280' xmlns='http://www.w3.org/2000/svg' {...props}>
    <mask
      height='280'
      id='mask0_7129_8163'
      maskUnits='userSpaceOnUse'
      style={{ maskType: 'alpha' }}
      width='280'
      x='0'
      y='0'
    >
      <circle cx='140' cy='140' fill='#162E2F' r='140' />
    </mask>
    <g mask='url(#mask0_7129_8163)'>
      <circle cx='140' cy='140' fill='#162E2F' r='140' />
      <path
        d='M-52.5 43.75H164.5V87.15L186.2 114.275L164.5 141.4L202.475 165.813L164.5 190.225V239.05H-52.5V43.75Z'
        fill='url(#paint0_linear_7129_8163)'
      />
      <rect fill='url(#paint1_linear_7129_8163)' height='26.25' width='105' y='87.5' />
      <rect
        fill='url(#paint2_linear_7129_8163)'
        height='26.25'
        transform='rotate(-180 105 192.5)'
        width='105'
        x='105'
        y='192.5'
      />
      <path
        d='M207.996 103.753C205.911 82.4357 187.51 75.3196 164.289 73.3233L164.239 43.75L146.251 43.7828L146.301 72.5772C141.572 72.5848 136.739 72.6867 131.936 72.7906L131.891 43.8051L113.913 43.8353L113.957 73.4005C110.064 73.4869 106.239 73.5666 102.51 73.5746L102.508 73.4822L77.699 73.5148L77.7361 92.7411C77.7361 92.7411 91.0185 92.466 90.7984 92.7098C98.0831 92.6994 100.462 96.9292 101.16 100.581C101.206 127.605 101.251 154.569 101.293 181.598C100.978 183.893 99.6369 187.556 94.5461 187.572C94.7775 187.776 81.4712 187.591 81.4712 187.591L77.9326 209.096L101.341 209.056C105.698 209.055 109.984 209.121 114.193 209.139L114.251 239.05L132.219 239.022L132.168 209.427C137.102 209.522 141.875 209.553 146.538 209.541L146.579 238.998L164.568 238.965L164.522 209.108C194.76 207.321 215.913 199.662 218.492 171.236C220.575 148.348 209.802 138.156 192.63 134.059C203.051 128.726 209.555 119.352 208.003 103.754L207.997 103.751L207.996 103.753ZM182.938 167.751C182.985 190.103 144.738 187.626 132.547 187.658L132.486 148.028C144.679 148.011 182.901 144.437 182.939 167.751L182.938 167.751ZM174.478 111.852C174.507 132.188 142.609 129.869 132.455 129.887L132.396 93.9452C142.55 93.9276 174.441 90.643 174.479 111.852L174.478 111.852Z'
        fill='#C4FDF2'
      />
    </g>
    <defs>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint0_linear_7129_8163'
        x1='202.475'
        x2='-52.5'
        y1='141.4'
        y2='141.4'
      >
        <stop stopColor='#4E988D' />
        <stop offset='1' stopColor='#264C4A' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint1_linear_7129_8163'
        x1='52.5'
        x2='52.5'
        y1='87.5'
        y2='113.75'
      >
        <stop stopOpacity='0.1' />
        <stop offset='1' stopOpacity='0' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint2_linear_7129_8163'
        x1='157.5'
        x2='157.5'
        y1='192.5'
        y2='218.75'
      >
        <stop stopOpacity='0.1' />
        <stop offset='1' stopOpacity='0' />
      </linearGradient>
    </defs>
  </Icon>
));

LBTC.displayName = 'LBTC';

export { LBTC };