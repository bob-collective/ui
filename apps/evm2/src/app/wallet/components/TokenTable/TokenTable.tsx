'use client';

import { useConnectModal } from '@gobob/connect-ui';
import { CurrencyAmount } from '@gobob/currency';
import { BTC } from '@gobob/icons';
import { usePrices } from '@gobob/react-query';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Avatar, Flex, Span, Table, TableProps, useCurrencyFormatter } from '@gobob/ui';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSessionStorage } from '@uidotdev/usehooks';

import { ReceiveTokenModal } from '../ReceiveTokenModal';
import { SendTokenModal } from '../SendTokenModal';

import { ButtonGroup } from './ButtonGroup';

import { ChainLogo, ChainLogoProps } from '@/components';
import { L2_CHAIN, RoutesPath } from '@/constants';
import { TokenData, useBalances, useTokens } from '@/hooks';
import { SessionStorageKey } from '@/types/session-storage';

const AmountCell = ({ amount, valueUSD }: { amount: string | number; valueUSD: string }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {`${new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))}`}
    </Span>
    <Span color='grey-50' size='xs' weight='medium'>
      {valueUSD}
    </Span>
  </Flex>
);

const AssetCell = ({
  name,
  chainIds,
  logo
}: {
  name: string;
  logo: string | ReactNode;
  chainIds: ChainLogoProps['chainId'][];
}) => (
  <Flex direction='column' gap='s'>
    <Flex alignItems='center' gap='s'>
      {typeof logo === 'string' ? <Avatar size='2xl' src={logo} /> : logo}
      <Span size='s' weight='bold'>
        {name}
      </Span>
    </Flex>
    <Flex gap='s'>
      {chainIds.map((chainId) => (
        <ChainLogo key={chainId} chainId={chainId} size='xs' />
      ))}
    </Flex>
  </Flex>
);

enum TokenTableColumns {
  ASSET = 'asset',
  BALANCE = 'balance',
  ACTION = 'action'
}

type TokenTableRow = {
  id: string;
  [TokenTableColumns.ASSET]: ReactNode;
  [TokenTableColumns.BALANCE]: ReactNode;
  [TokenTableColumns.ACTION]: ReactNode;
};

type Props = object;

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type TokenTableProps = Props & InheritAttrs;

const TokenTable = ({ ...props }: TokenTableProps): JSX.Element => {
  const { data: tokens } = useTokens(L2_CHAIN);

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });
  const { getBalance } = useBalances(L2_CHAIN);

  const { open } = useConnectModal();

  const formatUSD = useCurrencyFormatter();

  const { address: btcAddress } = useSatsAccount();
  const { data: satsAmount } = useSatsBalance();

  const t = useTranslations();

  const router = useRouter();
  const setTicker = useSessionStorage<string | undefined>(SessionStorageKey.TICKER, undefined)[1];

  const [sendModal, setSendModalState] = useState<{ isOpen: boolean; token?: TokenData | 'btc' }>({ isOpen: false });
  const [receiveModal, setReceiveModalState] = useState<{ isOpen: boolean; token?: TokenData | 'btc' }>({
    isOpen: false
  });

  const getUsdValue = useCallback(
    (ticker: string, amount: string | number) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !isNaN(amount as any) ? new Big(amount || 0).mul(getPrice(ticker) || 0).toNumber() : 0,
    [getPrice]
  );

  const columns = [
    { name: t('wallet.tokenTable.asset'), id: TokenTableColumns.ASSET },
    { name: t('wallet.tokenTable.balance'), id: TokenTableColumns.BALANCE },
    { name: '', id: TokenTableColumns.ACTION }
  ];

  const handlePressBridge = useCallback(
    (ticker: string) => {
      setTicker(ticker);
      router.push(RoutesPath.HOME);
    },
    [router, setTicker]
  );

  const handlePressBtcBridge = useCallback(() => router.push(`${RoutesPath.HOME}?network=bitcoin`), [router]);

  const btcRow: TokenTableRow = useMemo(() => {
    const amountCurrency = satsAmount ? CurrencyAmount.fromRawAmount(BITCOIN, satsAmount.value) : undefined;

    const balance = amountCurrency?.toExact() || 0;

    const balanceUSD = formatUSD(getUsdValue(BITCOIN.symbol, balance));

    return {
      id: BITCOIN.symbol,
      asset: <AssetCell chainIds={['BTC']} logo={<BTC size='s' />} name={BITCOIN.symbol} />,
      balance: <AmountCell amount={balance} valueUSD={balanceUSD} />,
      action: (
        <ButtonGroup
          connectLabel={t('wallet.tokenTable.connectBtcLabel')}
          showOnlyConnect={!btcAddress}
          ticker={BITCOIN.symbol}
          onPressBridge={handlePressBtcBridge}
          onPressConnect={() => open()}
          onPressReceive={() => setReceiveModalState({ isOpen: true, token: 'btc' })}
          onPressSend={() => setSendModalState({ isOpen: true, token: 'btc' })}
        />
      )
    };
  }, [btcAddress, formatUSD, getUsdValue, handlePressBtcBridge, open, satsAmount, t]);

  const tokenRows: TokenTableRow[] = useMemo(
    () =>
      tokens
        ? tokens.map((token) => {
            const balance = getBalance(token.currency.symbol);

            const amount = balance?.toExact() || 0;
            const balanceUSD = formatUSD(getUsdValue(token.currency.symbol, amount));

            return {
              id: token.currency.symbol,
              asset: (
                <AssetCell chainIds={[token.currency.chainId]} logo={token.raw.logoUrl} name={token.currency.symbol} />
              ),
              balance: <AmountCell amount={amount} valueUSD={balanceUSD} />,
              action: (
                <ButtonGroup
                  ticker={token.currency.symbol}
                  onPressBridge={() => handlePressBridge(token.currency.symbol)}
                  onPressReceive={() => setReceiveModalState({ isOpen: true, token })}
                  onPressSend={() => setSendModalState({ isOpen: true, token })}
                />
              )
            };
          })
        : [],
    [tokens, getBalance, formatUSD, getUsdValue, handlePressBridge]
  );

  const handleCloseSendModal = () => {
    setSendModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleCloseReceiveModal = () => {
    setReceiveModalState((s) => ({ ...s, isOpen: false }));
  };

  const rows = [btcRow, ...tokenRows];

  return (
    <>
      <Table {...props} columns={columns} rows={rows} wrapperProps={{ marginTop: '2xl', padding: '2xl' }} />
      {sendModal.token && (
        <SendTokenModal isOpen={sendModal.isOpen} token={sendModal.token} onClose={handleCloseSendModal} />
      )}
      {receiveModal.token && (
        <ReceiveTokenModal isOpen={receiveModal.isOpen} token={receiveModal.token} onClose={handleCloseReceiveModal} />
      )}
    </>
  );
};

export { TokenTable };
