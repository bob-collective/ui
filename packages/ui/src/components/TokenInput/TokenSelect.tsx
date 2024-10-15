import { EvmCurrencies } from '@gobob/currency';
import { useFilter } from '@react-aria/i18n';
import { mergeProps } from '@react-aria/utils';

import { Avatar } from '../Avatar';
import { Item, ModalSelectProps, Select } from '../Select';
import { Flex } from '../Flex';
import { Skeleton } from '../Skeleton';

import { Token } from './Token';
import { StyledTokenSelect } from './TokenInput.style';
import { TokenListItem } from './TokenListItem';

type TokenSelectItemProps = {
  currency: EvmCurrencies;
  logoUrl: string;
  balance?: {
    amount: string | number;
    usd: number;
  };
};

type TokenSelectProps = Omit<ModalSelectProps<TokenSelectItemProps>, 'children' | 'type' | 'value' | 'defaultValue'> & {
  featuredItems?: TokenSelectItemProps[];
  value?: string;
  defaultValue?: string;
};

const TokenSelect = ({ modalProps: modalPropsProp, size, featuredItems, ...props }: TokenSelectProps): JSX.Element => {
  // TODO: filtering to be replaced with backend approach?
  const { contains } = useFilter({
    sensitivity: 'base'
  });

  const modalProps: TokenSelectProps['modalProps'] = {
    title: 'Select Token',
    height: '700px',
    featuredItems: featuredItems?.map((item) => ({
      startAdornment: <Avatar size='3xl' src={item.logoUrl} />,
      children: item.currency.symbol,
      value: item.currency.address
    })),
    itemSkeleton: (props) => (
      <Flex {...props} alignItems='center' flex={1} gap='md' style={{ minHeight: 48 }}>
        <Skeleton height='5xl' rounded='full' width='5xl' />
        <Flex direction='column' flex='1'>
          <Skeleton width='50%' />
          <Skeleton />
        </Flex>
      </Flex>
    ),
    searchable: (searchTerm: string, item: TokenSelectItemProps) => {
      return (
        contains(searchTerm, item.currency.symbol) || (!!item.currency.name && contains(searchTerm, item.currency.name))
      );
    }
  };

  return (
    <Select<TokenSelectItemProps>
      {...props}
      aria-label='select token'
      asSelectTrigger={StyledTokenSelect}
      modalProps={mergeProps(modalProps, modalPropsProp)}
      placeholder='Select token'
      renderValue={({ value }) =>
        value ? <Token logoUrl={value.logoUrl} symbol={value.currency.symbol} /> : undefined
      }
      size={size === 'lg' ? 'md' : size}
      type='modal'
    >
      {(data: TokenSelectItemProps) => {
        return (
          <Item key={data.currency.address} textValue={data.currency.address}>
            <TokenListItem {...data} />
          </Item>
        );
      }}
    </Select>
  );
};

export { TokenSelect };
export type { TokenSelectItemProps, TokenSelectProps };
