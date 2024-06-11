import { Avatar } from '@gobob/ui';
import { Flex, P } from '@gobob/ui';

type Props = {
  imgSrc: string;
  name: string;
};

type InfluencerBackerProps = Props;

const InfluencerBacker = ({ name, imgSrc }: InfluencerBackerProps): JSX.Element => (
  <Flex alignItems='center' gap='lg'>
    <Avatar src={imgSrc} />
    <P weight='bold'>{name}</P>
  </Flex>
);

export { InfluencerBacker };
