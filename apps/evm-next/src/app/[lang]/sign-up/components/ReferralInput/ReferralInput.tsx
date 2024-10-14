import { useCallback, useEffect, useState } from 'react';
import OtpInput, { OTPInputProps } from 'react-otp-input';
import { useLabel } from '@react-aria/label';
import { Flex, Label, P } from '@gobob/ui';
import { mergeProps } from '@react-aria/utils';
import { useTheme } from 'styled-components';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

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
  const { i18n } = useLingui();

  const [otp, setOtp] = useState(refCode || '');
  const labelText = t(i18n)`Enter your access code (optional):`;

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

  const hasError = !!errorMessage;

  return (
    <Flex direction='column' gap='s'>
      <Flex direction='column' gap='lg'>
        {labelText && <Label {...labelProps}>{labelText}</Label>}
        <OtpInput
          {...props}
          skipDefaultStyles
          containerStyle={{
            gap: theme.spacing('md'),
            justifyContent: 'center',
            width: '100%'
          }}
          numInputs={6}
          renderInput={(props) => <StyledBaseInput {...mergeProps(props, fieldProps)} $hasError={hasError} />}
          value={otp}
          onChange={handleChange}
        />
      </Flex>
      <P
        color={hasError ? 'red-500' : undefined}
        size={{ base: 'xs', s: 's' }}
        style={{ visibility: hasError ? undefined : 'hidden' }}
      >
        {errorMessage || <Trans>Enter referral code (optional)</Trans>}
      </P>
    </Flex>
  );
};

export { ReferralInput };
