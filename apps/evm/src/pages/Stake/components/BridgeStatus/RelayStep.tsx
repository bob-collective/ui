import { Flex, FlexProps } from '@gobob/ui';
import { useMemo } from 'react';

import { L1_CHAIN } from '../../../../constants';
import { StakeSteps } from '../../constants';
import { BridgeTransaction } from '../../hooks';
import { MessageStatus } from '../../types';

import { StyledStatusActionButton } from './BridgeStatus.style';
import { StakeStep } from './StakeStep';

type Props = {
  data: BridgeTransaction;
  currentStep?: StakeSteps;
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
  const isWaitingRelay = useMemo(
    () => currentStep === 'relay' && data.status === MessageStatus.READY_FOR_RELAY && !isRelaySuccessful,
    [currentStep, isRelaySuccessful, data]
  );

  return (
    <Flex alignItems='center' flex={1} justifyContent='space-between'>
      <StakeStep data={data} isActing={isRelaying} isActionSuccessful={isRelaySuccessful} step='relay' />
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
          Finalize
        </StyledStatusActionButton>
      )}
    </Flex>
  );
};

export { RelayStep };
