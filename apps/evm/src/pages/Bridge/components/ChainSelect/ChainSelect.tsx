import { ChainId } from '@gobob/chains';
import { Card, Item, SelectProps } from '@gobob/ui';

import { Chain } from '../../../../components';

import { StyledSelect } from './ChainSelect.style';

type Props = {
  chainId: ChainId | 'BTC';
  selectProps?: Omit<SelectProps<{ id: ChainId | 'BTC' }>, 'children'>;
};

type ChainSelectProps = Props;

const ChainSelect = ({ chainId, selectProps }: ChainSelectProps): JSX.Element => {
  if (selectProps) {
    return (
      <StyledSelect
        modalProps={{ title: 'Select Network', size: 'xs' }}
        placeholder={<></>}
        size='lg'
        type='modal'
        {...selectProps}
      >
        {({ id }) => (
          <Item key={id} textValue={id.toString()}>
            <Chain chainId={id} />
          </Item>
        )}
      </StyledSelect>
    );
  }

  return (
    <Card
      alignSelf='stretch'
      background='grey-800'
      direction='row'
      flex='1 1 45%'
      gap='s'
      padding='lg'
      rounded='md'
      style={{ overflow: 'hidden', maxWidth: '45%' }}
    >
      <Chain chainId={chainId} />
    </Card>
  );
};

export { ChainSelect };
