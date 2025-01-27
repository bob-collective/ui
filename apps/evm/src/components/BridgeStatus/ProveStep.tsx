import { Flex, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { StyledStatusActionButton } from './BridgeStatus.style';
import { BridgeStep } from './BridgeStep';

import { L1_CHAIN } from '@/constants';
import { BridgeSteps, BridgeTransaction, BridgeTransactionStatus } from '@/types';

type Props = {
  data: BridgeTransaction;
  currentStep?: BridgeSteps;
  isProving?: boolean;
  isProveSuccessful: boolean;
  onPressProve?: () => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type ProveStepProps = Props & InheritAttrs;

const ProveStep = ({ data, currentStep, isProving, isProveSuccessful, onPressProve }: ProveStepProps): JSX.Element => {
  const isWaitingProve =
    currentStep === 'prove' && data.status === BridgeTransactionStatus.READY_TO_PROVE && !isProveSuccessful;

  return (
    <Flex alignItems='center' flex={1} justifyContent='space-between'>
      <BridgeStep data={data} isActing={isProving} isActionSuccessful={isProveSuccessful} step='prove' />
      {isWaitingProve && (
        <StyledStatusActionButton
          isSilentSwitch
          shouldPressAfterSwitch
          chain={L1_CHAIN}
          color='primary'
          loading={isProving}
          size='s'
          onPress={onPressProve}
        >
          <Trans>Prove</Trans>
        </StyledStatusActionButton>
      )}
    </Flex>
  );
};

export { ProveStep };
