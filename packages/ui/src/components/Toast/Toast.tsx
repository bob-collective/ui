import { Overlay } from '@react-aria/overlays';
import { ReactNode } from 'react';

import { ToastContainer } from './ToastContainer';

const Toast = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Overlay>
        <div data-react-aria-top-layer='true'>
          <ToastContainer position='top-right' />
        </div>
      </Overlay>
    </>
  );
};

export { Toast };
