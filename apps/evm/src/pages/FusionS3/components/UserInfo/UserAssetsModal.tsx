import { NATIVE } from '@gobob/tokens';
import { Avatar, Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Span, useLocale } from '@gobob/ui';
import { Address, isAddressEqual } from 'viem';
import { ERC20Token } from '@gobob/currency';
import { Spice } from '@gobob/icons';

import { useGetUser } from '../../../../hooks';
import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useGetTokensInfo } from '../../hooks/useGetTokensInfo';
import { useBridgeTokens } from '../../../Bridge/hooks';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAssetsModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const UserAssetsModal = (props: UserAssetsModalProps): JSX.Element => {
  const { data: user } = useGetUser();
  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const { locale } = useLocale();

  const { data: tokensInfo } = useGetTokensInfo({ enabled: !!props.isOpen });

  const data = tokens
    ?.map((token) => {
      if (token.l1Currency.isNative) {
        const stats = user?.depositStats?.find((item) => item.token_name === 'ethereum');

        const tokenInfo = tokensInfo?.find((info) => info.symbol === nativeToken.symbol);

        return {
          amount: stats?.total_amount || 0,
          logoUrl: token.l1Token.logoUrl,
          symbol: nativeToken.symbol,
          totalUsd: Number(stats?.total_usd || 0),
          multiplier: tokenInfo?.multiplier
        };
      }

      const stats = user?.depositStats?.find(
        (item) =>
          token.l1Currency.isToken &&
          isAddressEqual((token.l1Currency as ERC20Token)?.address, item?.token_address as Address)
      );

      const tokenInfo = tokensInfo?.find((info) => isAddressEqual(info.l2_address as Address, token.l2Token.address));

      return {
        amount: stats?.total_amount || 0,
        logoUrl: token.l1Token.logoUrl,
        symbol: token.l1Token.symbol,
        totalUsd: Number(stats?.total_usd || 0),
        multiplier: tokenInfo?.multiplier
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
              <Flex alignItems='center' flex='1 1 30%' gap='s'>
                <Avatar size='2xl' src={item.logoUrl} />
                <Span>{item.symbol}</Span>
              </Flex>
              <P color={item.totalUsd > 0 ? 'light' : 'grey-50'} style={{ flex: '1 1 45%' }}>
                {item.amount} (
                {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(item.totalUsd))})
              </P>
              {item.multiplier ? (
                <Flex alignItems='center' flex='1 1 25%' gap='md' justifyContent='flex-end'>
                  <P color='grey-50' size='s'>
                    {item.multiplier}x
                  </P>
                  <Spice size='s' />
                </Flex>
              ) : (
                <Flex flex='1 1 25%' />
              )}
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAssetsModal };
