import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const Meson = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect fill='white' height='24' rx='12' width='24' />
    <path
      d='M21.4458 17.2891V9.31691C21.4458 8.03731 20.4085 7 19.1289 7C18.5117 7 17.92 7.24627 17.4851 7.6842L10.2411 14.9776C9.96449 15.2562 9.96662 15.7064 10.246 15.9823L10.8127 16.5422C12.1993 17.9117 14.431 17.9062 15.8107 16.5298L18.5522 13.7951C18.6823 13.6653 18.8919 13.6617 19.0264 13.787C19.1663 13.9174 19.1719 14.1374 19.0387 14.2747L18.114 15.2285C17.9779 15.3688 17.981 15.5929 18.121 15.7293L20.241 17.7971C20.6905 18.2353 21.4458 17.917 21.4458 17.2891Z'
      fill='url(#paint0_linear_612_8604)'
    />
    <path
      d='M3 7.73738V15.6746C3 16.957 4.03958 17.9966 5.32196 17.9966C5.93629 17.9966 6.52559 17.7531 6.9608 17.3195L14.1994 10.1076C14.4785 9.82951 14.4775 9.3772 14.1972 9.10029L13.6331 8.54309C12.2465 7.17356 10.0148 7.17907 8.63508 8.55545L5.89363 11.2902C5.7635 11.42 5.55397 11.4236 5.41949 11.2983C5.2795 11.1679 5.27391 10.9479 5.4071 10.8105L6.33493 9.85363C6.46981 9.71451 6.46811 9.4929 6.3311 9.35588L4.21114 7.23574C3.76422 6.78878 3 7.1053 3 7.73738Z'
      fill='url(#paint1_linear_612_8604)'
    />
    <defs>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint0_linear_612_8604'
        x1='-8.37238'
        x2='21.8331'
        y1='7'
        y2='8.19266'
      >
        <stop stopColor='#06C17E' />
        <stop offset='1' stopColor='#06C1A8' />
      </linearGradient>
      <linearGradient
        gradientUnits='userSpaceOnUse'
        id='paint1_linear_612_8604'
        x1='3'
        x2='21.7034'
        y1='6.99999'
        y2='7.45683'
      >
        <stop stopColor='#06C17E' />
        <stop offset='1' stopColor='#06C1A8' />
      </linearGradient>
    </defs>
  </Icon>
));

Meson.displayName = 'Meson';

export { Meson };
