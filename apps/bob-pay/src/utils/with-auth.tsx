/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

export const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const isLoggedIn = useIsLoggedIn();
    const { sdkHasLoaded } = useDynamicContext();

    useEffect(() => {
      if (sdkHasLoaded && !isLoggedIn) {
        redirect('/login');
      }
    }, [isLoggedIn, sdkHasLoaded]);

    if (sdkHasLoaded && !isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
