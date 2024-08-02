import { useMutation } from '@gobob/react-query';
import { toast } from '@gobob/ui';
import { Button, CardProps, Divider, Dl, DlGroup, Dt, Flex, P } from '@gobob/ui';
import { FormEventHandler, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '@gobob/wagmi';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@gobob/ui';

import { RoutesPath } from '../../constants';
import { UserResponse, apiClient } from '../../utils';
import { LoginSection } from '../LoginSection';
import { ReferralInput } from '../ReferralInput';
import { HighlightText } from '../HighlightText';
import { Auditors } from '../Auditors';

import { StyledAuthCard, StyledDepositUsd, StyledH1 } from './AuthCard.style';

type Props = {
  user?: UserResponse | null;
  isLoadingReferralCode?: boolean;
  onValidReferralCode: () => void;
};

type AuthCardProps = Props & Omit<CardProps, keyof Props>;

const AuthCard = ({
  user,
  onValidReferralCode,
  isLoadingReferralCode: isLoadingReferralCodeProp,
  ...props
}: AuthCardProps): JSX.Element => {
  const [referalCode, setReferalCode] = useState('');
  const { locale } = useLocale();

  const { address } = useAccount();

  const { t } = useTranslation();

  const {
    mutate: validateReferralCode,
    error: referralCodeError,
    isPending: isPendingValidateReferralCode,
    reset
  } = useMutation({
    mutationKey: ['referralCode'],
    mutationFn: async (code: string) => apiClient.postReferralCode(code),
    onError: () => toast.error('Invalid invite code'),
    onSuccess: onValidReferralCode
  });

  const handleChange = (code: string) => {
    reset();
    setReferalCode(code);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    validateReferralCode(referalCode);
  };

  const isDisabled = referalCode.length < 6 || !!referralCodeError;

  const harvestedAmount = useMemo(
    () =>
      user &&
      Intl.NumberFormat(locale, { notation: 'compact', roundingMode: 'floor' } as any).format(
        user.leaderboardRank.total_reward_points
      ),
    [locale, user]
  );

  return (
    <StyledAuthCard
      background='grey-700'
      gap='4xl'
      paddingX={{ base: '2xl', s: '2xl', md: '2xl' }}
      paddingY={{ base: '4xl', md: '6xl' }}
      rounded='s'
      {...props}
    >
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center'>
        <StyledH1 align='center' fontFamily='eurostar' weight='bold'>
          {t('home.title')}
          <br />
          <HighlightText display='block'>{t('home.subtitle')}</HighlightText>
        </StyledH1>
        <P align='center' size='lg' weight='medium'>
          {t('home.content')}
        </P>
      </Flex>
      {user && address ? (
        <Flex direction='column' gap='4xl' paddingX={{ base: 'none', md: '4xl' }}>
          <Flex direction='column' gap='3xl'>
            <Dl>
              <DlGroup alignItems='flex-start' direction='column' flex={1} gap='xs' style={{ width: '100%' }}>
                <Dt weight='medium'>{t('home.harvestedSpice')}</Dt>
                <StyledDepositUsd fontFamily='eurostar' weight='bold'>
                  {harvestedAmount}
                </StyledDepositUsd>
              </DlGroup>
            </Dl>
          </Flex>
          <Button asChild color='primary' size='xl'>
            <Link to={RoutesPath.FUSION}>{t('home.dashboardLink')}</Link>
          </Button>
        </Flex>
      ) : (
        <Flex direction='column' gap='4xl' paddingX={{ base: 'none', md: '4xl' }}>
          <Flex direction='column' elementType='form' gap='3xl' onSubmit={handleSubmit}>
            <ReferralInput errorMessage={(referralCodeError as Error)?.message} onChange={handleChange} />
            <Button
              color='primary'
              disabled={isDisabled}
              loading={isPendingValidateReferralCode || isLoadingReferralCodeProp}
              size='xl'
              type='submit'
            >
              {t('home.buttonLabel')}
            </Button>
          </Flex>
          <Auditors />
          <Divider />
          {(!user || !address) && <LoginSection />}
        </Flex>
      )}
    </StyledAuthCard>
  );
};

export { AuthCard };
