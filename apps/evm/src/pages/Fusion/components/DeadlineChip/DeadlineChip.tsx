import { Chip, ChipProps } from '@gobob/ui';

type DeadlineChipProps = ChipProps;

const DeadlineChip = (props: DeadlineChipProps): JSX.Element => (
  <Chip background='grey-500' borderColor='grey-300' size='lg' {...props}>
    Ends 21st Nov 2024
  </Chip>
);

export { DeadlineChip };
