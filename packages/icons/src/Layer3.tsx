import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const Layer3 = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='#fff' viewBox='0 0 98 98' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0 62.517a3.38 3.38 0 0 1 3.38-3.38H42.24V98H3.38A3.38 3.38 0 0 1 0 94.62V62.517ZM42.241 59.138h52.38A3.38 3.38 0 0 1 98 62.517V94.62A3.38 3.38 0 0 1 94.62 98H81.936a6.759 6.759 0 0 1-4.908-2.113L42.24 59.137Z' />
    <path d='M0 3.38A3.38 3.38 0 0 1 3.38 0h35.482a3.38 3.38 0 0 1 3.38 3.38v55.758L1.936 18.1A6.759 6.759 0 0 1 0 13.365V3.379Z' />
  </Icon>
));

Layer3.displayName = 'Layer3';

export { Layer3 };
