import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Clock = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

Clock.displayName = 'Clock';

export { Clock };
