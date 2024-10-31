import { GatewayTransaction } from '../../hooks';
import { StatusChip } from '../StatusChip';

import { mempoolUrl } from '@/constants';
import { GatewaySteps } from '@/types';

const getLabel = (status: GatewaySteps, confirmations: number, totalConfirmations: number) => {
  switch (status) {
    case 'btc-confirmation':
      return confirmations <= totalConfirmations
        ? `BTC confirmations (${confirmations}/${totalConfirmations})`
        : 'BTC confirmations';
    case 'l2-processing':
    case 'l2-confirmation':
      return 'L2 confirmation';
    case 'l2-incomplete':
      return 'L2 incomplete';
  }
};

const getStatus = (data: GatewayTransaction, step: GatewaySteps) => {
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
        case 'l2-incomplete':
          return 'failed';
      }
    case 'l2-incomplete':
      return data.status === 'l2-incomplete' ? 'failed' : 'idle';
    case 'l2-confirmation':
      return data.status === 'l2-confirmation' ? 'complete' : 'idle';
  }
};

type GatewayStepProps = {
  data: GatewayTransaction;
  step?: GatewaySteps;
};

const GatewayStep = ({ step: stepProp, data }: GatewayStepProps): JSX.Element => {
  const step = stepProp || data.status;

  const label = getLabel(step, data.confirmations, data.totalConfirmations);

  const href = step === 'btc-confirmation' ? `${mempoolUrl}/tx/${data.btcTxId}` : undefined;

  const status = getStatus(data, step);

  return <StatusChip href={href} label={label} status={status} />;
};

export { GatewayStep };
