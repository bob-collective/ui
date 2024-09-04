import { Divider, Dl } from '@gobob/ui';

import { Spice } from './Spice';
import { Position } from './Position';
import { ReferralCode } from './ReferralCode';

const SeasonTwo = () => {
  return (
    <Dl direction='column' gap='lg' justifyContent='space-between'>
      {/* <BridgedAssets /> */}
      {/* <Divider /> */}
      <Spice />
      <Divider />
      <Position />
      <Divider />
      <ReferralCode />
    </Dl>
  );
};

export { SeasonTwo };
