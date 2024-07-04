import { Icon, IconProps } from '@gobob/ui';
import { forwardRef } from 'react';

const MedalGold = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M19.4693 8.45548L19.425 8.79081L19.7198 8.95672C20.7986 9.56398 21.5 10.7193 21.5 12C21.5 13.2807 20.7986 14.436 19.7198 15.0433L19.425 15.2092L19.4693 15.5445C19.4896 15.698 19.5 15.8501 19.5 16C19.5 18.0797 17.6203 19.7469 15.5453 19.4694L15.2092 19.4245L15.0431 19.72C14.4369 20.7986 13.2818 21.5 12 21.5C10.7182 21.5 9.56306 20.7986 8.95687 19.72L8.79081 19.4246L8.45486 19.4694C6.37509 19.7469 4.5002 18.0802 4.5 16.0003C4.50022 15.8481 4.51044 15.6961 4.5306 15.5452L4.57545 15.2094L4.28025 15.0433C3.20136 14.436 2.5 13.2807 2.5 12C2.5 10.7193 3.20136 9.56398 4.28025 8.95672L4.57501 8.79081L4.53069 8.45548C4.5104 8.30198 4.5 8.14989 4.5 8C4.5 5.91895 6.37575 4.2488 8.45384 4.53047L8.79044 4.57609L8.95687 4.27998C9.56306 3.20145 10.7182 2.5 12 2.5C13.2818 2.5 14.4369 3.20145 15.0431 4.27998L15.2096 4.57618L15.5463 4.53045C17.6196 4.24884 19.5 5.91924 19.5 8C19.5 8.14989 19.4896 8.30198 19.4693 8.45548Z'
      fill='url(#paint0_linear_698_2338)'
      stroke='url(#paint1_linear_698_2338)'
    />
    <g filter='url(#filter0_d_698_2338)'>
      <path
        d='M13.5043 7.27273V16H11.6591V9.02415H11.608L9.60938 10.277V8.64062L11.7699 7.27273H13.5043Z'
        fill='white'
      />
    </g>
    <defs>
      <filter
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'
        height='9.72729'
        id='filter0_d_698_2338'
        width='3.89502'
        x='9.60938'
        y='7.27271'
      >
        <feFlood floodOpacity='0' result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          result='hardAlpha'
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
        />
        <feOffset dy='1' />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.91 0' />
        <feBlend in2='BackgroundImageFix' mode='normal' result='effect1_dropShadow_698_2338' />
        <feBlend in='SourceGraphic' in2='effect1_dropShadow_698_2338' mode='normal' result='shape' />
      </filter>
      <linearGradient gradientUnits='userSpaceOnUse' id='paint0_linear_698_2338' x1='12' x2='12' y1='2' y2='22'>
        <stop offset='0.045' stopColor='#FF6301' />
        <stop offset='0.335' stopColor='#FFB777' />
        <stop offset='0.67' stopColor='#FF7F29' />
        <stop offset='1' stopColor='#FFB777' />
      </linearGradient>
      <linearGradient gradientUnits='userSpaceOnUse' id='paint1_linear_698_2338' x1='12' x2='12' y1='2' y2='22'>
        <stop stopColor='#FFA65F' />
        <stop offset='1' stopColor='#FFCFAD' />
      </linearGradient>
    </defs>
  </Icon>
));

MedalGold.displayName = 'Gold Medal';

export { MedalGold };
