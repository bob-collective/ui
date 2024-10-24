import { Card, Flex, InformationCircle, P, Switch, SwitchProps, Tooltip } from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { FuelStation } from '@gobob/icons';
import { useLingui } from '@lingui/react';

type Props = {
  isSelected?: SwitchProps['isSelected'];
  onChange?: SwitchProps['onChange'];
};

type GatewayGasSwitchProps = Props;

const GatewayGasSwitch = ({ isSelected, onChange }: GatewayGasSwitchProps): JSX.Element => {
  const { i18n } = useLingui();

  return (
    <Card background='grey-600' direction='row' gap='lg' justifyContent='space-between' rounded='md'>
      <Flex alignItems='center' gap='md'>
        <FuelStation color='primary-500' />
        <Flex direction='column'>
          <Flex alignItems='center' gap='s'>
            <P>
              <Trans>Top up Gas</Trans>
            </P>
            <Tooltip color='primary' label={t(i18n)`BOB Gateway allows you to swap BTC on Bitcoin to ETH on BOB`}>
              <InformationCircle color='grey-50' size='xs' />
            </Tooltip>
          </Flex>
          <P color='grey-50' size='xs'>
            <Trans>Get ETH for transaction fees on BOB</Trans>
          </P>
        </Flex>
      </Flex>
      <Switch
        aria-label={t(i18n)`enable ETH top-up for transaction fees on BOB network`}
        isSelected={isSelected}
        size='lg'
        onChange={onChange}
      />
    </Card>
  );
};

export { GatewayGasSwitch };
