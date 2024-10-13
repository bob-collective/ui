import { Alert, AlertProps, Button, Flex, P } from '@gobob/ui';
import { chain } from '@react-aria/utils';
import { Trans } from '@lingui/macro';

import { useLayoutContext } from '../Layout';

import { useLockedTokens } from '@/hooks';

type Props = { onPressWithdraw?: () => void };

type InheritAttrs = Omit<AlertProps, keyof Props>;

type WithdrawAlertProps = Props & InheritAttrs;

const WithdrawAlert = ({ onPressWithdraw, ...props }: WithdrawAlertProps): JSX.Element | null => {
  const { data: lockedTokens, isLoading } = useLockedTokens();

  const { setWithdrawAssetsOpen } = useLayoutContext();

  const hasLockedAssets = !isLoading && lockedTokens && lockedTokens?.length > 0;

  if (!hasLockedAssets) return null;

  const handlePress = () => setWithdrawAssetsOpen(true);

  return (
    <Alert {...props} status='warning' variant='outlined'>
      <Flex direction='column' gap='md'>
        <P size='inherit'>
          <Trans>You still have assets locked in Season One. Please redeem your funds</Trans>
        </P>
        <Button fullWidth color='primary' onPress={chain(onPressWithdraw, handlePress)}>
          <Trans>Withdraw Assets</Trans>
        </Button>
      </Flex>
    </Alert>
  );
};

export { WithdrawAlert };
