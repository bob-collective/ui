import { Chip, Flex, H1, P, ProgressBar } from '@gobob/ui';
import { Spice } from '@gobob/icons';

const SeasonInfo = () => {
  return (
    <Flex alignItems='center' direction='column' gap='4xl'>
      <Chip background='grey-500' borderColor='grey-300' size='lg'>
        Sep 15th - Nov 25th
      </Chip>
      <Flex alignItems='center' gap='md'>
        <Spice size='2xl' />
        <H1 size={{ base: '4xl', md: '6xl' }}>20M Spice</H1>
      </Flex>
      <P align='center' color='grey-50'>
        Season 3 is live from September 15 to November 25, with a huge 20M prize pool at stake. This is your final
        opportunity to gather Spice!
      </P>
      <Flex alignSelf='normal' direction='column' flex={1} gap='xl'>
        <ProgressBar
          fullWidth
          rounded
          aria-label='remaining spice'
          color='linear-gradient(90deg, #F35D00 0%, #04D1FF 100%)'
          direction='column-reverse'
          maxValue={20000000}
          minValue={0}
          value={16250000}
        />
        <Flex alignItems='center' gap='s' justifyContent='center'>
          <Spice color='grey-50' />
          <P color='grey-50'>18.25M / 20M Remaining</P>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { SeasonInfo };
