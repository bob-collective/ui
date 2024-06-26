import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const ETH = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='currentColor' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' {...props}>
    <title>ETH</title>
    <path
      d='M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z'
      fill='#627EEA'
    />
    <path d='M15.9983 4V12.5022L22.9955 15.7133L15.9983 4Z' fill='white' fillOpacity='0.602' />
    <path d='M15.9981 4L9 15.7133L15.9981 12.5022V4Z' fill='white' />
    <path d='M15.9983 21.2229V27L23.0002 17.0514L15.9983 21.2229Z' fill='white' fillOpacity='0.602' />
    <path d='M15.9981 27V21.222L9 17.0514L15.9981 27Z' fill='white' />
    <path d='M15.9983 19.8858L22.9955 15.7133L15.9983 12.5041V19.8858Z' fill='white' fillOpacity='0.2' />
    <path d='M9 15.7133L15.9981 19.8858V12.5041L9 15.7133Z' fill='white' fillOpacity='0.602' />
  </Icon>
));

ETH.displayName = 'ETH';

export { ETH };
