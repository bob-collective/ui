import { Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';

const Logo = () => (
  <Flex alignItems='center' gap='s'>
    <BOBLogo size='xl' />
    <Span size='xl' weight='bold'>
      BOB
    </Span>
  </Flex>
);

export { Logo };
