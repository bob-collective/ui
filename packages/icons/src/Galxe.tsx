import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const Galxe = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 1096 1097' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect fill='black' height='1096' rx='548' width='1096' y='0.5' />
    <path
      d='M691.763 366.79L225.969 635.455L658.722 316.398C673.226 305.71 693.808 310.004 702.802 325.591C711.133 340.024 706.191 358.467 691.744 366.809L691.763 366.79ZM758.319 599.306C752.07 588.487 738.229 584.798 727.398 591.04L419.027 768.889L747.45 631.464C760.023 626.205 765.116 611.11 758.3 599.306H758.319ZM913.905 360.888C900.859 338.321 871.492 331.341 849.679 345.623L176 786.5L895.027 424.087C918.317 412.34 926.951 383.455 913.905 360.888Z'
      fill='white'
    />
  </Icon>
));

Galxe.displayName = 'Galxe';

export { Galxe };
