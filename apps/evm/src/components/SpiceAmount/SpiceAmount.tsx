'use client';

import { Spice } from '@gobob/icons';

import { AnimantedAmount, AnimantedAmountProps } from '../AnimantedAmount';

type SpiceAmountProps = Omit<AnimantedAmountProps, 'icon'>;

const SpiceAmount = (props: SpiceAmountProps) => (
  <AnimantedAmount icon={<Spice style={{ width: '1em', height: '1em' }} />} {...props} />
);

export { SpiceAmount };
