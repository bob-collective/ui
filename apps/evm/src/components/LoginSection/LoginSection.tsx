import { Flex, FlexProps, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { LoginButton } from '../LoginButton';

type LoginSectionProps = FlexProps;

const LoginSection = ({ direction = { base: 'column', md: 'row' }, ...props }: LoginSectionProps): JSX.Element => {
  return (
    <Flex alignItems='center' direction={direction} gap='xs' justifyContent='center' {...props}>
      <P size='s' weight='bold'>
        <Trans>Already harvesting?</Trans>
      </P>
      <LoginButton color='primary' size='s' variant='ghost'>
        <Trans>Login with wallet</Trans>
      </LoginButton>
    </Flex>
  );
};

export { LoginSection };
