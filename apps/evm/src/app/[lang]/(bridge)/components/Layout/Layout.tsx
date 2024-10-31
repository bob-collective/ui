import { BannerCarousel } from '../BannerCarousel';

import { Main } from '@/components';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main maxWidth='5xl' padding='md'>
      <BannerCarousel />
      {children}
    </Main>
  );
};

export { Layout };
