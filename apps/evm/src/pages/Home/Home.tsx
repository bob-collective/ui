import { StyledAboutSection, StyledMainContent, StyledPageFooter } from './Home.style';
import { BackersCard, HeroSection, InfoSection } from './components';

const Home = (): JSX.Element => {
  return (
    <StyledMainContent padding='none'>
      <HeroSection />
      <StyledAboutSection>
        <BackersCard />
        <InfoSection />
        <StyledPageFooter />
      </StyledAboutSection>
    </StyledMainContent>
  );
};

export { Home };
