import { Flex, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useMemo } from 'react';

import { BridgeTransaction } from '../../hooks';

import { StyledStatusActionButton } from './BridgeStatus.style';
import { BridgeStep } from './BridgeStep';

import { BridgeSteps, BridgeTransactionStatus } from '@/types';
import { L1_CHAIN } from '@/constants';

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
  const isWaitingProve = useMemo(
    () => currentStep === 'prove' && data.status === BridgeTransactionStatus.READY_TO_PROVE && !isProveSuccessful,
    [currentStep, isProveSuccessful, data]
  );

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
