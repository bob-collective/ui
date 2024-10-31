import { Flex, FlexProps } from '@gobob/ui';
import { useMemo } from 'react';
import { Trans } from '@lingui/macro';

import { BridgeTransaction } from '../../hooks';

import { StyledStatusActionButton } from './BridgeStatus.style';
import { BridgeStep } from './BridgeStep';

import { L1_CHAIN } from '@/constants';
import { BridgeSteps } from '@/constants';
import { MessageStatus } from '@/types';

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
    () => currentStep === 'prove' && data.status === MessageStatus.READY_TO_PROVE && !isProveSuccessful,
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
