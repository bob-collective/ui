import { OnRampDepositSteps, OnRampSteps } from '../../constants';
import { OnRampTransaction } from '../../hooks';
import { mempoolUrl } from '../../../../constants';

import { Pill } from './Pill';

const getLabel = (status: OnRampDepositSteps, confirmations: number, totalConfirmations: number) => {
  switch (status) {
    case 'btc-confirmation':
      return confirmations <= totalConfirmations
        ? `BTC confirmations (${confirmations}/${totalConfirmations})`
        : 'BTC confirmations';
    case 'l2-processing':
    case 'l2-confirmation':
      return 'L2 confirmation';
  }
};

const getStatus = (data: OnRampTransaction, step: OnRampSteps) => {
  switch (step) {
    case 'btc-confirmation':
      return data.status === 'btc-confirmation' ? 'ongoing' : 'complete';
    case 'l2-processing':
      switch (data.status) {
        case 'btc-confirmation':
          return 'idle';
        case 'l2-processing':
          return 'ongoing';
        case 'l2-confirmation':
          return 'complete';
      }
    case 'l2-confirmation':
      return data.status === 'l2-confirmation' ? 'complete' : 'idle';
  }
};

type OnRampStepProps = {
  data: OnRampTransaction;
  step?: OnRampSteps;
};

const OnRampStep = ({ step: stepProp, data }: OnRampStepProps): JSX.Element => {
  const step = stepProp || data.status;

  const label = getLabel(step, data.confirmations, data.totalConfirmations);

  const href = step === 'btc-confirmation' ? `${mempoolUrl}/tx/${data.btcTxId}` : undefined;

  const status = getStatus(data, step);

  return <Pill href={href} label={label} status={status} />;
};

export { OnRampStep };
