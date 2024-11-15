import { Flex, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { BridgeTransaction } from '../../hooks';

import { StyledStatusActionButton } from './BridgeStatus.style';
import { BridgeStep } from './BridgeStep';

import { L1_CHAIN } from '@/constants';
import { BridgeSteps, BridgeTransactionStatus } from '@/types';

type Props = {
  data: BridgeTransaction;
  currentStep?: BridgeSteps;
  isRelaying?: boolean;
  isRelaySuccessful: boolean;
  onPressFinalize?: () => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type RelayStepProps = Props & InheritAttrs;

const RelayStep = ({
  data,
  currentStep,
  isRelaySuccessful,
  isRelaying,
  onPressFinalize
}: RelayStepProps): JSX.Element => {
  const isWaitingRelay =
    currentStep === 'relay' && data.status === BridgeTransactionStatus.READY_FOR_RELAY && !isRelaySuccessful;

  return (
    <Flex alignItems='center' flex={1} justifyContent='space-between'>
      <BridgeStep data={data} isActing={isRelaying} isActionSuccessful={isRelaySuccessful} step='relay' />
      {isWaitingRelay && (
        <StyledStatusActionButton
          isSilentSwitch
          shouldPressAfterSwitch
          chain={L1_CHAIN}
          color='primary'
          loading={isRelaying}
          size='s'
          onPress={onPressFinalize}
        >
          <Trans>Finalize</Trans>
        </StyledStatusActionButton>
      )}
    </Flex>
  );
};

export { RelayStep };
