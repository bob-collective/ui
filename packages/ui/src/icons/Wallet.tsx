import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Wallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      clipRule='evenodd'
      d='M17 4C18.5 4 19 4.5 19 6L19 8C20.1046 8 21 8.89543 21 10L21 17C21 19 20 20 17.999 20H6C4 20 3 19 3 17L3 7C3 5.5 4.5 4 6 4L17 4ZM5 7C5 6.44772 5.44772 6 6 6L19 6L19 8L6 8C5.44772 8 5 7.55229 5 7ZM17 16C18 16 19.001 15 19 14C18.999 13 18 12 17 12C16 12 15 13 15 14C15 15 16 16 17 16Z'
      fillRule='evenodd'
    />
  </Icon>
));

Wallet.displayName = 'Wallet';

export { Wallet };
