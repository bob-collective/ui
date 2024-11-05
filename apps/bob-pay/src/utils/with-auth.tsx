/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

export const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const isLoggedIn = useIsLoggedIn();

    useEffect(() => {
      if (!isLoggedIn) {
        redirect('/login');
      }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
