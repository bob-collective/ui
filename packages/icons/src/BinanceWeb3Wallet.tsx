import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const BinanceWeb3Wallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx='16' cy='16' fill='#080E11' r='16' />
    <g clipPath='url(#clip0_3487_21030)'>
      <path
        d='M12.1179 14.4038L16.0023 10.521L19.8882 14.4069L22.1471 12.1464L16.0023 6L9.85742 12.1449L12.1179 14.4038Z'
        fill='#F3BA2F'
      />
      <path d='M6 16.0008L8.25891 13.7403L10.5194 16.0008L8.25891 18.2597L6 16.0008Z' fill='#F3BA2F' />
      <path
        d='M12.1179 17.5962L16.0023 21.4806L19.8882 17.5947L22.1487 19.852L16.0039 25.9984L9.85742 19.8567L12.1179 17.5962Z'
        fill='#F3BA2F'
      />
      <path d='M21.4807 16.0008L23.7396 13.7403L26.0001 15.9992L23.7396 18.2613L21.4807 16.0008Z' fill='#F3BA2F' />
      <path
        d='M18.2944 15.9992L16.0023 13.7056L14.3073 15.4005L14.1114 15.5948L13.7102 15.9961L16.0023 18.2866L18.2944 16.0008V15.9992Z'
        fill='#F3BA2F'
      />
    </g>
    <defs>
      <clipPath id='clip0_3487_21030'>
        <rect fill='white' height='20' transform='translate(6 6)' width='20' />
      </clipPath>
    </defs>
  </Icon>
));

BinanceWeb3Wallet.displayName = 'BLogo';

export { BinanceWeb3Wallet };