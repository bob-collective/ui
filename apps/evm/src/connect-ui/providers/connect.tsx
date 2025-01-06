'use client';

import { FC, ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';

import { WalletType } from '../types';
import { ConnectBtcHandler, ConnectEvmHandler, ConnectModal } from '../component';

type UseConnectModalProps = { onOpen?: () => void; onClose?: () => void };

type OpenFnOptions = {
  type?: WalletType;
  onConnectEvm?: ConnectEvmHandler;
  onConnectBtc?: ConnectBtcHandler;
};

type ConnectData = {
  ref: RefObject<HTMLDivElement> | null;
  isOpen: boolean;
  open: (options?: OpenFnOptions) => void;
  close: () => void;
};

const ConnectContext = createContext<ConnectData>({
  ref: null,
  isOpen: false,
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
};

const ConnectProvider: FC<ConnectWalletContextProps> = ({ children }) => {
  const [state, setState] = useState<{
    isOpen: boolean;
    type?: WalletType;
    onConnectEvm?: ConnectEvmHandler;
    onConnectBtc?: ConnectBtcHandler;
  }>({
    isOpen: false
  });

  const ref = useRef<HTMLDivElement>(null);

  const handleOpen = (options?: OpenFnOptions) => {
    setState({
      isOpen: true,
      ...options
    });
  };

  const handleClose = () => {
    setState((s) => ({ ...s, isOpen: false, onConnectEvm: undefined, onConnectBtc: undefined }));
  };

  return (
    <ConnectContext.Provider value={{ ref, isOpen: state.isOpen, open: handleOpen, close: handleClose }}>
      {children}
      <ConnectModal ref={ref} onClose={handleClose} {...state} />
    </ConnectContext.Provider>
  );
};

export { ConnectProvider, useConnectModal };
export type { UseConnectModalProps };
