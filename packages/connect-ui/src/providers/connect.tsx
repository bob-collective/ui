import { FC, ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';
import { mergeProps } from '@react-aria/utils';

import { ConnectType } from '../types';
import { ConnectBtcHandler, ConnectEvmHandler, ConnectModal, ConnectModalProps } from '../component';

type UseConnectModalProps = { onOpen?: () => void; onClose?: () => void };

type OpenFnOptions = {
  onConnectEvm?: ConnectEvmHandler;
  onConnectBtc?: ConnectBtcHandler;
};

type ConnectData = {
  ref: RefObject<HTMLDivElement> | null;
  isOpen: boolean;
  type: ConnectType;
  open: (options?: OpenFnOptions) => void;
  close: () => void;
};

const ConnectContext = createContext<ConnectData>({
  ref: null,
  isOpen: false,
  type: 'both',
  open: () => {},
  close: () => {}
});

const useConnectModal = (): ConnectData => {
  const context = useContext(ConnectContext);

  if (context === undefined) {
    throw new Error('useConnectModal must be used within a ConnectProvider!');
  }

  return context;
};

type ConnectWalletContextProps = {
  children: ReactNode;
  type?: ConnectType;
  modalProps?: Partial<Omit<ConnectModalProps, 'type'>>;
};

const ConnectProvider: FC<ConnectWalletContextProps> = ({ children, type = 'both', modalProps }) => {
  const [state, setState] = useState<{
    isOpen: boolean;
    onConnectEvm?: ConnectEvmHandler;
    onConnectBtc?: ConnectBtcHandler;
  }>({
    isOpen: false
  });

  const ref = useRef<HTMLDivElement>(null);

  const handleOpen = (options?: OpenFnOptions) => {
    setState({
      isOpen: true,
      onConnectBtc: options?.onConnectBtc,
      onConnectEvm: options?.onConnectEvm
    });
  };

  const handleClose = () => {
    setState((s) => ({ ...s, isOpen: false, onConnectEvm: undefined, onConnectBtc: undefined }));
  };

  return (
    <ConnectContext.Provider value={{ ref, isOpen: state.isOpen, type, open: handleOpen, close: handleClose }}>
      {children}
      <ConnectModal
        ref={ref}
        isOpen={state.isOpen}
        type={type}
        onClose={handleClose}
        {...mergeProps(modalProps, { onConnectBtc: state?.onConnectBtc, onConnectEvm: state?.onConnectEvm })}
      />
    </ConnectContext.Provider>
  );
};

export { ConnectProvider, useConnectModal };
export type { UseConnectModalProps };
