import { usePrices } from '@gobob/hooks';
import { BOBLogo, ETH, FuelStation } from '@gobob/icons';
import {
  Avatar,
  Button,
  Clock,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
  ModalProps,
  P,
  useCurrencyFormatter
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { Address } from 'viem';
import { useId } from 'react';

import { AmountLabel, ChainAsset } from '@/components';
import { chainL1, chainL2 } from '@/constants';
import { TransactionDirection } from '@/types';
import { calculateAmountUSD } from '@/utils';
import { BridgeToken } from '@/hooks';

type Props = {
  direction: TransactionDirection;
  amount: CurrencyAmount<Ether | ERC20Token>;
  gasEstimate?: CurrencyAmount<Ether>;
  approveGasEstimate?: CurrencyAmount<Ether>;
  token: BridgeToken;
  approveTx?: Address;
  isApproving?: boolean;
  onPressApprove?: () => void;
  onPressStartBridge: () => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type BridgeTransactionModalProps = Props & InheritAttrs;

const BridgeTransactionModal = ({
  onClose,
  isOpen,
  direction,
  amount,
  gasEstimate,
  approveGasEstimate,
  token,
  approveTx,
  isApproving,
  onPressApprove,
  onPressStartBridge,
  ...props
}: BridgeTransactionModalProps): JSX.Element => {
  const descriptionId = useId();

  const format = useCurrencyFormatter();
  const { getPrice } = usePrices();

  const fromChain = direction === TransactionDirection.L1_TO_L2 ? chainL1 : chainL2;
  const toChain = direction === TransactionDirection.L1_TO_L2 ? chainL2 : chainL1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader align='start'>
        <Trans>Review bridge</Trans>
      </ModalHeader>
      <ModalBody gap='md' padding='even'>
        <Flex alignItems='center' direction='column' gap='md'>
          <Flex alignItems='center' gap='md'>
            <ChainAsset
              asset={<Avatar alt={amount.currency.symbol} size='5xl' src={token.l1Token.logoUrl} />}
              chainId={toChain.id}
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
        </Flex>
        <P align='center' id={descriptionId} size='s' style={{ marginTop: '0.75rem' }} weight='bold'>
          <Trans>
            Follow these steps to bridge your {token.l1Token.symbol} onto {toChain.name}
          </Trans>
        </P>
        <List
          aria-labelledby={descriptionId}
          gap='xs'
          marginTop='xs'
          style={{ display: 'grid', gridAutoRows: '1fr 1fr 1fr' }}
        >
          {
            (approveGasEstimate && (
              <ListItem alignItems='center' backgroundColor='grey-500' gap='s' justifyContent='space-between'>
                <Flex alignItems='center' gap='s'>
                  <ETH size='xl' />
                  <Flex direction='column'>
                    <P size='s' weight='semibold'>
                      <Trans>Approve {token.l1Token.symbol}</Trans>
                    </P>
                    <Flex alignItems='center' gap='xs'>
                      <FuelStation color='grey-50' size='xxs' />
                      <P color='grey-50' size='s'>
                        <AmountLabel amount={approveGasEstimate} />
                      </P>
                    </Flex>
                  </Flex>
                </Flex>
                <Button color='light' disabled={!!approveTx} loading={isApproving} size='s' onPress={onPressApprove}>
                  {approveTx ? <Trans>Approved</Trans> : <Trans>Approve</Trans>}
                </Button>
              </ListItem>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            )) as any
          }
          <ListItem alignItems='center' backgroundColor='grey-500' gap='s' justifyContent='space-between'>
            <Flex alignItems='center' gap='s'>
              <ETH size='xl' />
              <Flex direction='column'>
                <P size='s' weight='semibold'>
                  <Trans>Start on {fromChain.name}</Trans>
                </P>
                <Flex alignItems='center' gap='xs'>
                  <FuelStation color='grey-50' size='xxs' />
                  <P color='grey-50' size='s'>
                    <AmountLabel amount={gasEstimate} />
                  </P>
                </Flex>
              </Flex>
            </Flex>
            <Button color='light' size='s' onPress={onPressStartBridge}>
              <Trans>Start</Trans>
            </Button>
          </ListItem>
          <ListItem alignItems='center' backgroundColor='grey-500' gap='s' style={{ height: '100%' }}>
            <Clock color='grey-50' size='xl' />
            <P weight='semibold'>
              <Trans>Wait ~3 min</Trans>
            </P>
          </ListItem>
          <ListItem alignItems='center' backgroundColor='grey-500' gap='s' style={{ height: '100%' }}>
            <BOBLogo size='xl' />
            <P weight='semibold'>
              <Trans>
                Get {amount.toSignificant(2)} {amount.currency.symbol} on {toChain.name}
              </Trans>
            </P>
          </ListItem>
        </List>
      </ModalBody>
    </Modal>
  );
};

export { BridgeTransactionModal };
