import { useConnectModal } from '@gobob/connect-ui';
import { CurrencyAmount } from '@gobob/currency';
import { BTC } from '@gobob/icons';
import { usePrices } from '@gobob/react-query';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Avatar, Flex, Span, Table, TableProps, useCurrencyFormatter } from '@gobob/ui';
import Big from 'big.js';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ChainLogo, ChainLogoProps } from '../../../../components';
import { L2_CHAIN, RoutesPath } from '../../../../constants';
import { TokenData, useBalances, useTokens } from '../../../../hooks';
import { ReceiveTokenModal } from '../ReceiveTokenModal';
import { SendTokenModal } from '../SendTokenModal';

import { ButtonGroup } from './ButtonGroup';

const AmountCell = ({ amount, valueUSD }: { amount: string | number; valueUSD: string }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {`${new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))}`}
    </Span>
    <Span color='grey-200' size='xs' weight='medium'>
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

type Props = {};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type TokenTableProps = Props & InheritAttrs;

const TokenTable = ({ ...props }: TokenTableProps): JSX.Element => {
  const { data: tokens } = useTokens(L2_CHAIN);

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { getBalance } = useBalances(L2_CHAIN);

  const { open } = useConnectModal();

  const formatUSD = useCurrencyFormatter();

  const { address: btcAddress } = useSatsAccount();
  const { data: satsAmount } = useSatsBalance();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [sendModal, setSendModalState] = useState<{ isOpen: boolean; token?: TokenData | 'btc' }>({ isOpen: false });
  const [receiveModal, setReceiveModalState] = useState<{ isOpen: boolean; token?: TokenData | 'btc' }>({
    isOpen: false
  });

  const getUsdValue = useCallback(
    (ticker: string, amount: string | number) =>
      !isNaN(amount as any) ? new Big(amount || 0).mul(getPrice(ticker) || 0).toNumber() : 0,
    [getPrice]
  );

  const columns = [
    { name: t('wallet.tokenTable.asset'), id: TokenTableColumns.ASSET },
    { name: t('wallet.tokenTable.balance'), id: TokenTableColumns.BALANCE },
    { name: '', id: TokenTableColumns.ACTION }
  ];

  const handlePressBridge = useCallback(
    (ticker: string) => navigate(RoutesPath.BRIDGE, { state: { ticker } }),
    [navigate]
  );

  const btcRow: TokenTableRow = useMemo(() => {
    const amountCurrency = satsAmount ? CurrencyAmount.fromRawAmount(BITCOIN, satsAmount) : undefined;

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
          // TODO: to be enabled when onramp is implemented
          // onPressBridge={() => handlePressBridge(BITCOIN.symbol)}
          onPressConnect={() => open()}
          onPressReceive={() => setReceiveModalState({ isOpen: true, token: 'btc' })}
          onPressSend={() => setSendModalState({ isOpen: true, token: 'btc' })}
        />
      )
    };
  }, [btcAddress, formatUSD, getUsdValue, open, satsAmount, t]);

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
