import { Chip, Flex, H1, P } from '@gobob/ui';

import { Barometer } from './Barometer';

const SeasonInfo = () => {
  return (
    <Flex alignItems='center' direction='column' gap='4xl'>
      <Chip background='grey-500' borderColor='grey-300' size='lg'>
        Ends 21st Nov 2024
      </Chip>
      <H1 size={{ base: '4xl', md: '6xl' }}>$49.12M DeFi TVL</H1>
      <P align='center' color='grey-50'>
        Season 3 is live from September 15 to November 25, with a huge 20M prize pool at stake. This is your final
        opportunity to gather Spice!
      </P>
      <Barometer />
    </Flex>
  );
};

export { SeasonInfo };
