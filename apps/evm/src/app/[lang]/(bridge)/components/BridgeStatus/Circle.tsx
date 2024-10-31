import { Icon, IconProps } from '@gobob/ui';
import { forwardRef } from 'react';

const Circle = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} fill='none' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5ZM0.926338 5C0.926338 7.24982 2.75018 9.07366 5 9.07366C7.24982 9.07366 9.07366 7.24982 9.07366 5C9.07366 2.75018 7.24982 0.926338 5 0.926338C2.75018 0.926338 0.926338 2.75018 0.926338 5Z'
      fill='white'
    />
  </Icon>
));

Circle.displayName = 'Circle';

export { Circle };
