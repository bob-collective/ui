import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Power = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

Power.displayName = 'Power';

export { Power };
