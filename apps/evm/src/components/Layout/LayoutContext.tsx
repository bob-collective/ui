'use client';

import React, { ReactNode, useState } from 'react';

interface LayoutConfig {
  // TODO: this is temp while fusion
  isWithdrawAssetsOpen: boolean;
  setWithdrawAssetsOpen: (isOpen: boolean) => void;
}

const defaultContext: LayoutConfig = {
  isWithdrawAssetsOpen: false,
  setWithdrawAssetsOpen: () => {}
};

const LayoutContext = React.createContext<LayoutConfig>(defaultContext);

const useLayoutContext = (): LayoutConfig => React.useContext<LayoutConfig>(LayoutContext);

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isWithdrawAssetsOpen, setWithdrawAssetsOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ isWithdrawAssetsOpen, setWithdrawAssetsOpen }}>{children}</LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayoutContext };
