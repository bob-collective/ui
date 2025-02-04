import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount, Ether } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { Avatar, Card, Dd, Dl, DlProps, Flex, P, Spinner, useCurrencyFormatter } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { StyledDlGroup, StyledDt } from './TransactionDetails.style';

import { AmountLabel, ChainAsset, ChainLogo } from '@/components';
import { useBalances, useGasTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';
import { chainL1, chainL2, L1_CHAIN, L2_CHAIN } from '@/constants';

type Props = {
  chainId: ChainId;
  amount: CurrencyAmount<Currency>;
  gasEstimate?: CurrencyAmount<Ether>;
  logoUrl: string;
};

type InheritAttrs = Omit<DlProps, keyof Props>;

type TransactionDetailsProps = Props & InheritAttrs;

// TODO: refresh gas estimate
const TransactionDetails = ({
  chainId,
  amount,
  gasEstimate,
  logoUrl,
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const format = useCurrencyFormatter();
  const { getPrice } = usePrices();
  const { getBalance } = useBalances(chainId);
  const { data: gasTokens } = useGasTokens(chainId);
  const { i18n } = useLingui();

  return (
    <Card background='grey-600' rounded='md'>
      <Dl direction='column' gap='none' {...props}>
        <Flex gap='s' justifyContent='space-between'>
          <P size='s' weight='bold'>
            <Trans>Get on {chainId === L2_CHAIN ? chainL2.name : chainL1.name}</Trans>
          </P>
          <Flex alignItems='center'>
            <ChainLogo chainId={chainId === L1_CHAIN ? chainL1.id : chainL2.id} size='xs' />
            <ChainLogo
              chainId={chainId === L1_CHAIN ? chainL2.id : chainL1.id}
              size='xs'
              style={{ marginLeft: '-4px' }}
            />
          </Flex>
        </Flex>
        <Flex alignItems='center' gap='md'>
          <ChainAsset
            asset={<Avatar alt={amount.cu} size='6xl' src={logoUrl} />}
            chainId={chainId}
            chainProps={{ size: 'xs' }}
          />
          <Flex direction='column' flex={1}>
            <P lineHeight='1.2' rows={1} size='lg' style={{ whiteSpace: 'normal' }} weight='semibold'>
              {amount.toSignificant(3)} {amount.currency.symbol}
            </P>
            <P color='grey-50' lineHeight='1.2' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
              {format(calculateAmountUSD(amount, getPrice(amount.currency.symbol)))}
            </P>
          </Flex>
        </Flex>
        <StyledDlGroup justifyContent='space-between'>
          <StyledDt color='grey-50' size='xs'>
            <Trans>Transfer time</Trans>
          </StyledDt>
          <Dd size='xs'>{chainId === L2_CHAIN ? chainL2.name : chainL1.name}</Dd>
        </StyledDlGroup>

        {gasEstimate && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              <Trans>Gas Estimate</Trans>
            </StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingGasEstimate && <Spinner size='12' thickness={2} />}
                <AmountLabel amount={gasEstimate} />
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
      </Dl>
    </Card>
  );
};

export { TransactionDetails };
