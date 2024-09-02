import { Divider, Dl } from '@gobob/ui';

import { Spice } from './Spice';
import { Position } from './Position';
import { ReferralCode } from './ReferralCode';
import { DepositedAssets } from './DepositedAssets';
import { CompleteSeasonOne } from './CompleteSeasonOne';

const SeasonOne = () => {
  return (
    <Dl direction='column' gap='lg' justifyContent='space-between'>
      <DepositedAssets />
      <Divider />
      <Spice />
      <Divider />
      <Position />
      <Divider />
      <ReferralCode />
      <Divider />
      <CompleteSeasonOne />
    </Dl>
  );
};

export { SeasonOne };
