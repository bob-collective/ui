import { mergeProps } from '@react-aria/utils';

import { Item, ModalSelectProps, Select } from '../Select';

import { StyledTokenSelect } from './TokenInput.style';
import { TokenListItem } from './TokenListItem';
import { Token } from './Token';

type TokenData = {
  currency: { decimals: number; symbol: string };
  logoUrl: string;
  balance: string | number;
  balanceUSD: number;
};

type TokenSelectProps = Omit<ModalSelectProps<TokenData>, 'children' | 'type'>;

// TODO: value control from currency object
const TokenSelect = ({ modalProps, size, ...props }: TokenSelectProps): JSX.Element => {
  return (
    <Select<TokenData>
      {...props}
      aria-label='select token'
      asSelectTrigger={StyledTokenSelect}
      modalProps={mergeProps({ title: 'Select Token', listProps: { maxHeight: '32rem' } }, modalProps)}
      placeholder='Select token'
      renderValue={({ value }) =>
        value ? <Token logoUrl={value.logoUrl} symbol={value.currency.symbol} /> : undefined
      }
      size={size === 'lg' ? 'md' : size}
      type='modal'
    >
      {(data: TokenData) => (
        <Item key={data.currency.symbol} textValue={data.currency.symbol}>
          <TokenListItem {...data} />
        </Item>
      )}
    </Select>
  );
};

export { TokenSelect };
export type { TokenData, TokenSelectProps };
