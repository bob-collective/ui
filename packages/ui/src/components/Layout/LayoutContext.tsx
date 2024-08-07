import React, { ReactNode, useState } from 'react';

interface LayoutConfig {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const defaultContext: LayoutConfig = { isSidebarOpen: false, setSidebarOpen: () => {} };

const LayoutContext = React.createContext<LayoutConfig>(defaultContext);

const useLayoutContext = (): LayoutConfig => React.useContext<LayoutConfig>(LayoutContext);

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return <LayoutContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>{children}</LayoutContext.Provider>;
};

export { LayoutProvider, useLayoutContext };
