'use client';

import React, { ReactNode, useState } from 'react';

interface LayoutConfig {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  // TODO: this is temp while fusion
  isWithdrawAssetsOpen: boolean;
  setWithdrawAssetsOpen: (isOpen: boolean) => void;
}

const defaultContext: LayoutConfig = {
  isSidebarOpen: false,
  isWithdrawAssetsOpen: false,
  setWithdrawAssetsOpen: () => {},
  setSidebarOpen: () => {}
};

const LayoutContext = React.createContext<LayoutConfig>(defaultContext);

const useLayoutContext = (): LayoutConfig => React.useContext<LayoutConfig>(LayoutContext);

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isWithdrawAssetsOpen, setWithdrawAssetsOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, isWithdrawAssetsOpen, setWithdrawAssetsOpen, setSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayoutContext };
