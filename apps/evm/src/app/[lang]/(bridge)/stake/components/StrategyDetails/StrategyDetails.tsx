'use client';

import {
  ArrowTopRightOnSquare,
  Avatar,
  Button,
  Card,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Span,
  useCurrencyFormatter,
  useMediaQuery
} from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useTheme } from 'styled-components';
import { Address } from 'viem';
import { sendGAEvent } from '@next/third-parties/google';
import { useAccount } from 'wagmi';

import { StrategyCurrency } from '../../constants';
import { StrategyData } from '../../hooks';
import { StrategyRewards } from '../StrategyRewards';

import { StrategyBreakdown } from './StrategyBreakdown';
import { StyledAddressButton } from './StrategyDetails.style';

import { AmountLabel, ChainAsset } from '@/components';
import { chainL2, L2_CHAIN } from '@/constants';
import { useGetStrategies, useSubscribeBalances } from '@/hooks';
import { useUserAgent } from '@/user-agent';

const MiddleNodeCard = ({
  node,
  hideSymbol,
  onPress
}: {
  node: StrategyCurrency;
  hideSymbol: boolean;
  onPress: () => void;
}) => {
  const { i18n } = useLingui();

  const addressEl = (
    <Span noWrap color='grey-50' rows={1} size={hideSymbol ? 's' : 'xs'}>
      {truncateEthAddress(node.currency.address)}
    </Span>
  );

  const infoEl = (
    <Flex direction='column' style={{ overflow: 'hidden' }}>
      <Span lineHeight='1.2' rows={1} size={hideSymbol ? 'md' : 's'}>
        {node.currency.symbol}
      </Span>
      {hideSymbol ? (
        <StyledAddressButton
          aria-label={t(i18n)`navigate to ${node.currency.symbol} contract on explorer`}
          onPress={onPress}
        >
          {addressEl}
          <ArrowTopRightOnSquare color='grey-50' size='xs' />
        </StyledAddressButton>
      ) : (
        addressEl
      )}
    </Flex>
  );

  const cardEl = (
    <Card
      isHoverable
      isPressable
      alignItems='center'
      background='grey-600'
      direction='row'
      gap='s'
      justifyContent='center'
      padding='md'
      onPress={hideSymbol ? undefined : onPress}
    >
      <ChainAsset
        asset={<Avatar alt={node.currency.symbol} size='4xl' src={node.logoUrl} />}
        chainId={L2_CHAIN}
        chainProps={{ size: 'xs' }}
      />

      {!hideSymbol && infoEl}
    </Card>
  );

  if (!hideSymbol) {
    return cardEl;
  }

  return (
    <Popover>
      <PopoverTrigger>{cardEl}</PopoverTrigger>
      <PopoverContent>
        <PopoverBody gap='md' padding='lg'>
          {infoEl}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

type StrategyDetailsProps = {
  strategy?: StrategyData;
  isLending?: boolean;
};

const StrategyDetails = ({ strategy, isLending }: StrategyDetailsProps) => {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobile: isMobileUserAgent } = useUserAgent();
  const { address } = useAccount();

  const isMobile = isMobileViewport || isMobileUserAgent;

  const format = useCurrencyFormatter();
  const { refetch } = useGetStrategies();

  useSubscribeBalances([strategy?.contract.deposit.token, strategy?.contract.withdraw.token], refetch);

  const middleNodes = Boolean(strategy?.info.breakdown.length) ? strategy!.info.breakdown.slice(0, -1) : [];

  const hasTooManyMiddleNodes = middleNodes.length >= 3;

  const lastNode = strategy?.info.breakdown.at(-1);

  const handlePressBOBStake = () =>
    sendGAEvent('event', 'bob_stake', {
      evm_address: address,
      asset: strategy?.contract.inputToken.symbol,
      amount: strategy?.contract.deposit.amount
    });

  const btcNode = (
    <Card
      alignItems='center'
      background='grey-600'
      direction='row'
      gap='md'
      justifyContent='center'
      paddingX='lg'
      paddingY='s'
    >
      <Avatar
        alt='BTC'
        size={{ base: '4xl', s: '5xl' }}
        src='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
      />

      <Flex direction='column' style={{ overflow: 'hidden' }}>
        <Span color='grey-50' size='xs'>
          <Trans>Input</Trans>
        </Span>
        <Span lineHeight='1.2' rows={1} size='s'>
          BTC
        </Span>
        <Span color='grey-50' size='xs'>
          Bitcoin
        </Span>
      </Flex>
    </Card>
  );

  const handleContractNavigate = (address: Address) =>
    window.open(new URL(`/address/${address}`, chainL2.blockExplorers?.default.url).toString(), '_blank', 'noreferrer');

  const outputNode = lastNode && (
    <Card
      isHoverable
      isPressable
      alignItems='center'
      background='grey-600'
      direction='row'
      gap='md'
      justifyContent='center'
      paddingX='lg'
      paddingY='s'
      onPress={() => handleContractNavigate(lastNode.currency.address)}
    >
      <ChainAsset
        asset={<Avatar alt={lastNode.currency.symbol} size={{ base: '4xl', s: '5xl' }} src={lastNode.logoUrl} />}
        chainId={L2_CHAIN}
        chainProps={{ size: 'xs' }}
      />
      <Flex direction='column' style={{ overflow: 'hidden' }}>
        <Flex alignItems='center' gap='xs' justifyContent='space-between'>
          <Span color='grey-50' size='xs'>
            {strategy?.contract.outputToken && <Trans>Output</Trans>}
          </Span>
          <ArrowTopRightOnSquare color='grey-50' size='xxs' />
        </Flex>
        <Span lineHeight='1.2' rows={1} size='s'>
          {lastNode.currency.symbol}
        </Span>
        <Span noWrap color='grey-50' rows={1} size='xs'>
          {truncateEthAddress(lastNode.currency.address)}
        </Span>
      </Flex>
    </Card>
  );

  return (
    <Dl direction='column' flex='1.2 0 0%' gap='xl'>
      {strategy?.contract.withdraw.amount.greaterThan(0) && (
        <Card alignItems='flex-start' direction='column' flex='1'>
          <Dt color='grey-50' size='s'>
            {isLending ? <Trans>Lent Amount</Trans> : <Trans>Staked Amount</Trans>}
          </Dt>
          <Flex wrap elementType='dd' gap='s'>
            <Span color='light' size='lg' weight='semibold'>
              {strategy ? (
                <AmountLabel hidePrice amount={strategy.contract.withdraw.amount} />
              ) : (
                <Skeleton height='4xl' rounded='full' width='4xl' />
              )}
            </Span>
            <Span color='grey-50' size='lg' weight='semibold'>
              ({format(strategy.contract.withdraw.usd)})
            </Span>
          </Flex>
        </Card>
      )}
      {strategy?.contract.deposit.amount.greaterThan(0) && (
        <Card alignItems='flex-start' direction='row' flex='1' justifyContent='space-between'>
          <Flex direction='column'>
            <Dt color='grey-50' size='s'>
              <Trans>BOB {strategy.contract.inputToken.symbol} Balance</Trans>
            </Dt>
            <Flex wrap elementType='dd' gap='s'>
              <Span color='light' size='lg' weight='semibold'>
                {strategy ? (
                  <AmountLabel hidePrice amount={strategy.contract.deposit.amount} />
                ) : (
                  <Skeleton height='4xl' rounded='full' width='4xl' />
                )}
              </Span>
              <Span color='grey-50' size='lg' weight='semibold'>
                ({format(strategy.contract.deposit.usd)})
              </Span>
            </Flex>
          </Flex>
          <Button
            elementType={Link}
            size='xl'
            {...{ href: strategy.info.links.manage, external: true }}
            color='primary'
            onPress={handlePressBOBStake}
          >
            {isLending ? <Trans>Lend</Trans> : <Trans>Stake</Trans>}
          </Button>
        </Card>
      )}
      <Flex direction={{ base: 'column', s: 'row' }} gap='xl' style={{ width: '100%' }}>
        <Card alignItems='flex-start' direction='column' flex={0.7} gap='md'>
          <Dt color='grey-50' size='s'>
            <Trans>Rewards</Trans>
          </Dt>
          {strategy ? (
            <StrategyRewards wrap elementType='dd' incentives={strategy.info.incentives} />
          ) : (
            <Skeleton height='2xl' rounded='full' width='7xl' />
          )}
        </Card>
        <Card alignItems='flex-start' direction='column' flex={0.3} gap='md'>
          <Dt color='grey-50' size='s'>
            <Trans>TVL</Trans>
          </Dt>
          <Dd color='light' size='lg' weight='semibold'>
            {strategy?.contract.tvl ? format(strategy.contract.tvl) : '-'}
          </Dd>
        </Card>
      </Flex>
      <Card direction='column' gap='xl' style={{ width: '100%' }}>
        <DlGroup alignItems='flex-start' direction='column'>
          <Dt color='grey-50' size='s'>
            <Trans>Description</Trans>
          </Dt>
          <Dd size='s' style={{ width: '100%' }}>
            {strategy ? strategy.info.description : <Skeleton count={2} />}
          </Dd>
        </DlGroup>
        <Divider />
        <Flex gap='md'>
          <DlGroup alignItems='flex-start' direction='column' gap='xl' style={{ width: '100%' }}>
            <Dt color='grey-50' size='s'>
              <Trans>Strategy Breakdown</Trans>
            </Dt>
            {strategy ? (
              <StrategyBreakdown
                firstNode={btcNode}
                lastNode={outputNode}
                middleNodes={middleNodes.map((node, idx) => (
                  <MiddleNodeCard
                    key={idx}
                    hideSymbol={isMobile || hasTooManyMiddleNodes}
                    node={node}
                    onPress={() => handleContractNavigate(node.currency.address)}
                  />
                ))}
              />
            ) : (
              <Skeleton height='10xl' style={{ width: '100%' }} />
            )}
          </DlGroup>
        </Flex>
        <Divider />
        <DlGroup alignItems='flex-start' direction='column' gap='lg'>
          <Dt color='grey-50' size='s'>
            <Trans>Additional Information</Trans>
          </Dt>
          <Flex wrap elementType='dd' gap={{ base: 'md', s: 'xl' }}>
            <Link external icon href={strategy?.info.links.landingPage}>
              <Trans>Website</Trans>
            </Link>
            {strategy?.info.links.securityReview && (
              <>
                <Link external icon href={strategy.info.links.securityReview}>
                  <Trans>Security Review by Bitcoin Layers</Trans>
                </Link>
              </>
            )}
          </Flex>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { StrategyDetails };
