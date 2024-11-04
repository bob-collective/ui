import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { PropsWithChildren } from 'react';

export const Wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
