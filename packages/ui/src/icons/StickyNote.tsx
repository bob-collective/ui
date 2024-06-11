import { forwardRef } from 'react';

import { Icon, IconProps } from '../components';

const StickyNote = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g clipPath='url(#clip0_10_443)'>
      <path
        d='M19 3H4.99C3.89 3 3 3.9 3 5L3.01 19C3.01 20.1 3.9 21 5 21H15L21 15V5C21 3.9 20.1 3 19 3ZM7 8H17V10H7V8ZM12 14H7V12H12V14ZM14 19.5V14H19.5L14 19.5Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0_10_443'>
        <rect fill='currentColor' height='24' width='24' />
      </clipPath>
    </defs>
  </Icon>
));

StickyNote.displayName = 'StickyNote';

export { StickyNote };
