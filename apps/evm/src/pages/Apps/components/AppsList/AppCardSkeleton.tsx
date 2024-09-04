import { Card, Divider, Flex, Skeleton } from '@gobob/ui';

import { StyledImgWrapper } from './AppCard.style';

// TODO: add description skeleton
const AppCardSkeleton = (): JSX.Element => {
  return (
    <Card borderColor='grey-300' padding='none'>
      <StyledImgWrapper alignItems='center' justifyContent='center' padding='5xl'>
        <Skeleton height='9xl' rounded='md' width='9xl' />
      </StyledImgWrapper>
      <Divider />
      <Flex direction='column' padding='xl'>
        <Flex direction='column' gap='xl'>
          <Skeleton height='3xl' width='50%' />
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
