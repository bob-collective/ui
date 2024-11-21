/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { redirect, RedirectType } from 'next/navigation';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const withAuth = <T extends any>(WrappedComponent: React.FC<T>) => {
  return function WithAuth(props: T) {
    const isLoggedIn = useIsLoggedIn();
    const { sdkHasLoaded } = useDynamicContext();

    useEffect(() => {
      if (sdkHasLoaded && !isLoggedIn) {
        redirect('/login?redirect=true', RedirectType.push);
      }
    }, [isLoggedIn, sdkHasLoaded]);

    if (sdkHasLoaded && !isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...(props as any)} />;
  };
};
