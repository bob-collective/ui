import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const MedalSilver = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M19.4693 8.45548L19.425 8.79081L19.7198 8.95672C20.7986 9.56398 21.5 10.7193 21.5 12C21.5 13.2807 20.7986 14.436 19.7198 15.0433L19.425 15.2092L19.4693 15.5445C19.4896 15.698 19.5 15.8501 19.5 16C19.5 18.0797 17.6203 19.7469 15.5453 19.4694L15.2092 19.4245L15.0431 19.72C14.4369 20.7986 13.2818 21.5 12 21.5C10.7182 21.5 9.56306 20.7986 8.95687 19.72L8.79081 19.4246L8.45486 19.4694C6.37509 19.7469 4.5002 18.0802 4.5 16.0003C4.50022 15.8481 4.51044 15.6961 4.5306 15.5452L4.57545 15.2094L4.28025 15.0433C3.20136 14.436 2.5 13.2807 2.5 12C2.5 10.7193 3.20136 9.56398 4.28025 8.95672L4.57501 8.79081L4.53069 8.45548C4.5104 8.30198 4.5 8.14989 4.5 8C4.5 5.91895 6.37575 4.2488 8.45384 4.53047L8.79044 4.57609L8.95687 4.27998C9.56306 3.20145 10.7182 2.5 12 2.5C13.2818 2.5 14.4369 3.20145 15.0431 4.27998L15.2096 4.57618L15.5463 4.53045C17.6196 4.24884 19.5 5.91924 19.5 8C19.5 8.14989 19.4896 8.30198 19.4693 8.45548Z'
      fill='url(#paint0_linear_698_2340)'
      stroke='url(#paint1_linear_698_2340)'
    />
    <g filter='url(#filter0_d_698_2340)'>
      <path
        d='M8.70739 16V14.6705L11.8139 11.794C12.0781 11.5384 12.2997 11.3082 12.4787 11.1037C12.6605 10.8991 12.7983 10.6989 12.892 10.5028C12.9858 10.304 13.0327 10.0895 13.0327 9.85938C13.0327 9.60369 12.9744 9.38352 12.858 9.19886C12.7415 9.01136 12.5824 8.8679 12.3807 8.76847C12.179 8.66619 11.9503 8.61506 11.6946 8.61506C11.4276 8.61506 11.1946 8.66903 10.9957 8.77699C10.7969 8.88494 10.6435 9.03977 10.5355 9.24148C10.4276 9.44318 10.3736 9.68324 10.3736 9.96165H8.62216C8.62216 9.39062 8.75142 8.89489 9.00994 8.47443C9.26847 8.05398 9.63068 7.72869 10.0966 7.49858C10.5625 7.26847 11.0994 7.15341 11.7074 7.15341C12.3324 7.15341 12.8764 7.2642 13.3395 7.4858C13.8054 7.70455 14.1676 8.00852 14.4261 8.39773C14.6847 8.78693 14.8139 9.23295 14.8139 9.7358C14.8139 10.0653 14.7486 10.3906 14.6179 10.7116C14.4901 11.0327 14.2614 11.3892 13.9318 11.7812C13.6023 12.1705 13.1378 12.6378 12.5384 13.1832L11.2642 14.4318V14.4915H14.929V16H8.70739Z'
        fill='white'
      />
    </g>
    <defs>
      <filter
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'
        height='9.84668'
        id='filter0_d_698_2340'
        width='6.30688'
        x='8.62207'
        y='7.15332'
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
        <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0' />
        <feBlend in2='BackgroundImageFix' mode='normal' result='effect1_dropShadow_698_2340' />
        <feBlend in='SourceGraphic' in2='effect1_dropShadow_698_2340' mode='normal' result='shape' />
      </filter>
      <linearGradient gradientUnits='userSpaceOnUse' id='paint0_linear_698_2340' x1='12' x2='12' y1='2' y2='22'>
        <stop offset='0.045' stopColor='#FFEFE4' />
        <stop offset='0.335' stopColor='#8B8B8B' />
        <stop offset='0.67' stopColor='#4D4D4D' />
        <stop offset='1' stopColor='#565656' />
      </linearGradient>
      <linearGradient gradientUnits='userSpaceOnUse' id='paint1_linear_698_2340' x1='12' x2='12' y1='2' y2='22'>
        <stop stopColor='white' />
        <stop offset='1' stopColor='#999999' />
      </linearGradient>
    </defs>
  </Icon>
));

MedalSilver.displayName = 'Silver Medal';

export { MedalSilver };
