import { mergeProps } from '@react-aria/utils';
import { Currency } from '@gobob/currency';

import { Item, ModalSelectProps, Select } from '../Select';

import { StyledTokenSelect } from './TokenInput.style';
import { TokenListItem } from './TokenListItem';
import { Token } from './Token';

type TokenSelectItemProps = {
  currency: Currency;
  logoUrl: string;
  balance: string | number;
  balanceUSD: number;
};

type TokenSelectProps = Omit<ModalSelectProps<TokenSelectItemProps>, 'children' | 'type'>;

const TokenSelect = ({ modalProps, size, ...props }: TokenSelectProps): JSX.Element => {
  return (
    <Select<TokenSelectItemProps>
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
      {(data: TokenSelectItemProps) => (
        <Item key={data.currency.symbol} textValue={data.currency.symbol}>
          <TokenListItem {...data} />
        </Item>
      )}
    </Select>
  );
};

export { TokenSelect };
export type { TokenSelectItemProps, TokenSelectProps };
