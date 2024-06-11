import { ReactNode } from 'react';

import { useGeoblocking } from '../../hooks/useGeoblock';

type Props = {
  children: ReactNode;
};

const Geoblock = ({ children }: Props): JSX.Element => {
  useGeoblocking();

  return <>{children}</>;
};

export { Geoblock };
