import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const Check = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='m4.5 12.75 6 6 9-13.5' strokeLinecap='round' strokeLinejoin='round' />
  </Icon>
));

Check.displayName = 'Check';

export { Check };
