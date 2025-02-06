import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const T = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect fill='#7D00FF' height='48' rx='24' width='48' />
    <path
      d='M39 16H29.0013V19.3327H39V16ZM22.3336 19.3327H19.0007V22.6673H22.3336V19.3327ZM19.0007 36H22.3336V26H19.0007V36ZM25.6664 19.3327V22.6673H29.0013V19.3327H25.6664ZM25.6664 36H29.0013V26H25.6664V36ZM25.6664 16H22.3336V19.3327H25.6664V16ZM9 16V19.3327H19.0007V16H9ZM39 26V22.6673H29.0013V26H39ZM22.3336 22.6673V26H25.6664V22.6673H22.3336ZM9 22.6673V26H19.0007V22.6673H9Z'
      fill='white'
    />
  </Icon>
));

T.displayName = 'T';

export { T };
