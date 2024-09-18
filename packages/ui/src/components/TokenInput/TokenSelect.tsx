import { Currency } from '@gobob/currency';
import { mergeProps } from '@react-aria/utils';
import { useFilter } from '@react-aria/i18n';

import { Item, ModalSelectProps, Select } from '../Select';
import { Avatar } from '../Avatar';

import { Token } from './Token';
import { StyledTokenSelect } from './TokenInput.style';
import { TokenListItem } from './TokenListItem';

type TokenSelectItemProps = {
  currency: Currency;
  logoUrl: string;
  balance: string | number;
  balanceUSD: number;
};

type TokenSelectProps = Omit<ModalSelectProps<TokenSelectItemProps>, 'children' | 'type'> & {
  featuredItems?: TokenSelectItemProps[];
};

const TokenSelect = ({ modalProps, size, featuredItems, ...props }: TokenSelectProps): JSX.Element => {
  const { contains } = useFilter({
    sensitivity: 'base'
  });

  return (
    <Select<TokenSelectItemProps>
      {...props}
      aria-label='select token'
      asSelectTrigger={StyledTokenSelect}
      modalProps={mergeProps(
        {
          title: 'Select Token',
          // TODO: handle height better
          // listProps: { maxHeight: '32rem' },
          featuredItems: featuredItems?.map((item) => ({
            startAdornment: <Avatar size='3xl' src={item.logoUrl} />,
            children: item.currency.symbol,
            value: item.currency.symbol
          })),
          // TODO: need to get current search term to compare it
          searchable: ({ value }: { value: TokenSelectItemProps }) => {
            return;
          }
        },
        modalProps
      )}
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
