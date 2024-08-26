import { Chip, ChipProps, Flex } from '@gobob/ui';

import { Fire } from './Fire';

type Props = { iconPlacement?: 'start' | 'end'; isLit?: boolean };

type InheritAttrs = Omit<ChipProps, keyof Props>;

type VotingChipProps = Props & InheritAttrs;

const VotingChip = ({ iconPlacement = 'start', isLit, children }: VotingChipProps): JSX.Element => {
  return (
    <Chip background='grey-900' borderColor={isLit ? 'primary-500' : 'grey-700'} style={{ padding: 0 }}>
      <Flex alignItems='center' elementType='span' gap='xs' justifyContent='center'>
        {iconPlacement === 'start' && <Fire isLit={isLit} size='xs' />}
        <Flex elementType='span' paddingRight='xs'>
          {children}
        </Flex>
        {iconPlacement === 'end' && <Fire isLit={isLit} size='xs' />}
      </Flex>
    </Chip>
  );
};

export { VotingChip };
