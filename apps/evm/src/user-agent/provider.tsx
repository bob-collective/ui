'use client';

import { createContext, useContext } from 'react';
import { userAgent } from 'next/server';

interface UserAgentConfig {
  isMobile: boolean;
}

const defaultContext: UserAgentConfig = {
  isMobile: false
};

type Props = {
  children: React.ReactNode;
  userAgent: ReturnType<typeof userAgent>;
};

const UserAgentContext = createContext<UserAgentConfig>(defaultContext);

export const useUserAgent = () => useContext<UserAgentConfig>(UserAgentContext);

export function UserAgentProvider({ userAgent, children }: Props) {
  const isMobile = userAgent.device.type === 'mobile';

  return <UserAgentContext.Provider value={{ isMobile }}>{children}</UserAgentContext.Provider>;
}
