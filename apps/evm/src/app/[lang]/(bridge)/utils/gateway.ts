import { GatewayTransactionSpeedData } from '@/types';

const isLowFeeRate = (feeRate: number, feeRateData: GatewayTransactionSpeedData) => {
  return feeRate < feeRateData.slow * 0.8;
};

const isHighFeeRate = (feeRate: number, feeRateData: GatewayTransactionSpeedData) => {
  return feeRate > feeRateData.fastest * 1.2;
};

export { isHighFeeRate, isLowFeeRate };
