const isSSR = typeof window === 'undefined';

export const isClient = !isSSR;
