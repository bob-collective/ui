import { NATIVE } from '@gobob/tokens';
import { Avatar, Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Span, useLocale } from '@gobob/ui';
import { Address, isAddressEqual } from 'viem';
import { ERC20Token } from '@gobob/currency';

import { useGetUser, useTokens } from '../../../../hooks';
import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useGetTokensInfo } from '../../hooks/useGetTokensInfo';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAssetsModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const UserAssetsModal = (props: UserAssetsModalProps): JSX.Element => {
  const { data: user } = useGetUser();
  const { data: tokens } = useTokens(L1_CHAIN);
  const { locale } = useLocale();

  const { data: tokenInfo } = useGetTokensInfo({ enabled: !!props.isOpen });

  const data = tokens
    ?.map((item) => {
      if (item.currency.isNative) {
        const stats = user?.depositStats?.find((token) => token.token_name === 'ethereum');

        return {
          amount: stats?.total_amount || 0,
          logoUrl: item.raw.logoUrl,
          symbol: nativeToken.symbol,
          totalUsd: Number(stats?.total_usd || 0)
        };
      }

      const stats = user?.depositStats?.find(
        (token) =>
          item.currency.isToken &&
          isAddressEqual((item.currency as ERC20Token)?.address, token?.token_address as Address)
      );

      return {
        amount: stats?.total_amount || 0,
        logoUrl: item.raw.logoUrl,
        symbol: item.currency.symbol,
        totalUsd: Number(stats?.total_usd || 0)
      };
    })
    .sort((a, b) => b.totalUsd - a.totalUsd);

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Total Assets
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P>Bridge High Priority assets to earn multipliers on your spice</P>
        <List direction='column' gap='md'>
          {data?.map((item, key) => (
            <ListItem key={key} alignItems='center' flex={1} justifyContent='space-between'>
              <Flex alignItems='center' gap='s'>
                <Avatar size='2xl' src={item.logoUrl} />
                <Span>{item.symbol}</Span>
              </Flex>
              <P>
                {item.amount} (
                {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(item.totalUsd))})
              </P>
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAssetsModal };
