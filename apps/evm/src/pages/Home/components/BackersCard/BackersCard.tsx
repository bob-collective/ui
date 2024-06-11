import { Flex, P } from '@gobob/ui';
import { Avatar } from '@gobob/ui';

import castleIslandSrc from '../../../../assets/castle-island-ventures.png';
import mechanismCapitalSrc from '../../../../assets/mechanism-capital.png';
import cmsSrc from '../../../../assets/cms-investor.png';
import banklessVenturesSrc from '../../../../assets/bankless-ventures.png';
import iosgVenturesSrc from '../../../../assets/iosg-ventures.png';
import domoSrc from '../../../../assets/domo.png';
import danHeldSrc from '../../../../assets/dan-held.png';
import coinbaseSrc from '../../../../assets/coinbase-ventures.png';

import { StyledBackerLogos, StyledBackersCard, StyledImg } from './BackersCard.style';

const BackersCard = (): JSX.Element => (
  <Flex alignItems='center' direction='column' style={{ width: '100%' }}>
    <StyledBackersCard
      alignItems='center'
      background='grey-700'
      bordered={false}
      gap='4xl'
      padding={{ base: '2xl', md: '3xl' }}
      paddingBottom={{ base: '2xl', md: '4xl' }}
      paddingTop={{ base: '2xl', md: '3xl' }}
      rounded='none'
    >
      <P align='center' size='md'>
        Some of our backers
      </P>
      <StyledBackerLogos>
        <StyledImg alt='castle island ventures logo' height='43' src={castleIslandSrc} width='175' />
        <StyledImg alt='castle island ventures logo' height='43' src={coinbaseSrc} width='175' />
        <StyledImg alt='mechanism capital logo' height='46' src={mechanismCapitalSrc} width='122' />
        <StyledImg alt='cms logo' height='46' src={cmsSrc} width='123' />
        <StyledImg alt='bankless ventures logo' height='44' src={banklessVenturesSrc} width='111' />
        <StyledImg alt='iosg ventures logo' height='44' src={iosgVenturesSrc} width='152' />
        <Flex alignItems='center' gap='md' justifyContent='center'>
          <Avatar alt='domo avatar' size='6xl' src={danHeldSrc} />
          <P weight='bold'>Dan Held</P>
        </Flex>
        <Flex alignItems='center' gap='md' justifyContent='center'>
          <Avatar alt='domo avatar' size='6xl' src={domoSrc} />
          <P weight='bold'>domodata</P>
        </Flex>
      </StyledBackerLogos>
    </StyledBackersCard>
  </Flex>
);

export { BackersCard };
