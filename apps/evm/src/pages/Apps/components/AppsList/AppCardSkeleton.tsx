import { Card, Divider, Flex, Skeleton } from '@gobob/ui';

import { StyledCardHeader } from './AppCard.style';

// TODO: add description skeleton
const AppCardSkeleton = (): JSX.Element => {
  return (
    <Card borderColor='grey-300' padding='none'>
      <StyledCardHeader gap='lg' paddingX='xl' paddingY='3xl'>
        <Skeleton height='9xl' rounded='md' width='9xl' />
        <Flex direction='column' flex={1} justifyContent='center'>
          <Skeleton height='2xl' width='50%' />
          <Skeleton count={2} />
        </Flex>
      </StyledCardHeader>
      <Divider />
      <Flex direction='column' padding='xl'>
        <Flex direction='column' gap='xl'>
          <Flex direction='column' gap='xxs'>
            <Skeleton count={3} />
          </Flex>
        </Flex>
        <Divider marginY='xl' />
        <Skeleton height='3xl' rounded='full' />
      </Flex>
    </Card>
  );
};

export { AppCardSkeleton };
