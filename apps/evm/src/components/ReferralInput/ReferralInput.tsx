import { useCallback, useEffect, useState } from 'react';
import OtpInput, { OTPInputProps } from 'react-otp-input';
import { useLabel } from '@react-aria/label';
import { Field, Flex, P, TextLink } from '@gobob/ui';
import { mergeProps } from '@react-aria/utils';
import { useTheme } from 'styled-components';
import { Trans } from 'react-i18next';

import { useGetRefCode } from '../../hooks';

import { StyledBaseInput } from './ReferralInput.style';

type Props = {
  errorMessage?: string;
};

type InheritAttrs = Omit<OTPInputProps, keyof Props | 'numInputs' | 'renderInput'>;

type ReferralInputProps = Props & InheritAttrs;

const ReferralInput = ({ onChange, errorMessage, ...props }: ReferralInputProps): JSX.Element => {
  const theme = useTheme();
  const refCode = useGetRefCode();

  const [otp, setOtp] = useState(refCode || '');
  const labelText = 'Enter your access code:';
  const { fieldProps, labelProps } = useLabel({ label: labelText });

  const handleChange = useCallback(
    (otp: string) => {
      setOtp(otp);
      onChange(otp);
    },
    [onChange]
  );

  useEffect(() => {
    if (!otp) return;

    handleChange(otp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <Flex direction='column' gap='lg'>
      <Field direction='column' gap='lg' label={labelText} labelProps={labelProps}>
        <OtpInput
          {...props}
          skipDefaultStyles
          containerStyle={{ gap: theme.spacing('md'), justifyContent: 'center', width: '100%' }}
          numInputs={6}
          renderInput={(props) => <StyledBaseInput {...mergeProps(props, fieldProps)} $hasError={!!errorMessage} />}
          value={otp}
          onChange={handleChange}
        />
      </Field>
      <P align='center' size='s'>
        <Trans
          components={{ discordLink: <TextLink external href='https://discord.gg/gobob' size='s' /> }}
          i18nKey='home.referralCodePrompt'
        />
      </P>
    </Flex>
  );
};

export { ReferralInput };
