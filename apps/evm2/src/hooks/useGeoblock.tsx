'use client';

import { useEffect } from 'react';

// TODO: Move this to hooks package
const useGeoblocking = (): void => {
  const isGeoblockEnabled = process.env.NEXT_PUBLIC_GEOBLOCK_ENABLED;

  useEffect(() => {
    if (!isGeoblockEnabled) return;

    const checkCountry = async () => {
      try {
        const response = await fetch('/check_access');

        if (response.status === 403) {
          // TODO: Make sure this page has been added to Webflow
          window.location.replace('/geoblock');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    };

    checkCountry();
  }, [isGeoblockEnabled]);
};

export { useGeoblocking };
