import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const Avalon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 288.47699 288.85699' xmlns='http://www.w3.org/2000/svg' {...props}>
    <defs id='defs3' />
    <g id='g1' transform='translate(0,33.999997)'>
      <path d='m 100.05501,0 h 44.172 L 44.171012,220.476 H 1.171875e-5 Z' fill='#ffffff' id='path1' />
      <path d='m 188.42201,0 h -44.172 l 100.055,220.476 h 44.172 z' fill='#ffffff' id='path2' />
      <path d='m 143.86601,108.894 44.095,111.963 H 99.771012 Z' fill='#ffffff' id='path3' />
    </g>
  </Icon>
));

Avalon.displayName = 'Avalon';

export { Avalon };
