'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Divider, Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { FormEventHandler, Suspense, useEffect, useState } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import { Auditors, HighlightText, ReferralInput } from './components';
import { StyledAuthCard, StyledH1 } from './SignUp.style';

import { Geoblock, LoginSection, Main } from '@/components';
import { RoutesPath } from '@/constants';
import { useGetUser, useSignUp } from '@/hooks';
import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';
import { chakraPetch } from '@/app/fonts';

const SignUp = (): JSX.Element | null => {
  const { address } = useAccount();

  const { setShowAuthFlow, setSelectedTabIndex } = useDynamicContext();

  const { i18n } = useLingui();

  const router = useRouter();
  const params = useParams();
  const { data: user } = useGetUser();

  const [referalCode, setReferalCode] = useState('');

  const [isConnecting, setConnecting] = useState(false);

  const { mutate: signUp, isPending: isLoadingSignUp } = useSignUp();

  const {
    mutateAsync: validateReferralCodeAsync,
    error: referralCodeError,
    isPending: isPendingValidateReferralCode,
    reset
  } = useMutation({
    mutationKey: fusionKeys.referralCode(),
    mutationFn: async (code: string) => apiClient.postReferralCode(code)
  });

  useEffect(() => {
    if (user && address) {
      router.push(`/${params.lang}${RoutesPath.FUSION}`);
    }
  }, [user, address, router, params.lang]);

  const handleChange = (code: string) => {
    reset();
    setReferalCode(code);
  };

  useAccountEffect({
    onConnect: () => {
      if (isConnecting && address) {
        signUp(address);

        setConnecting(false);
      }
    }
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (referalCode) {
      await validateReferralCodeAsync?.(referalCode);
    }

    if (!address) {
      setSelectedTabIndex(1);
      setShowAuthFlow(true);

      setConnecting(true);

      return;
    }

    return signUp(address);
  };

  return (
    <Geoblock>
      <Main maxWidth='3xl' padding='lg'>
        <Flex alignItems='center' flex={1} justifyContent='center'>
          <StyledAuthCard
            gap='4xl'
            paddingX={{ base: '2xl', s: '2xl', md: '2xl' }}
            paddingY={{ base: '4xl', md: '6xl' }}
          >
            <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center'>
              <StyledH1 align='center' style={chakraPetch.style} weight='bold'>
                <Trans>THE FIRST HYBRID L2</Trans>
                <br />
                <HighlightText display='block'>
                  <Trans>POWERED BY BTC & ETH</Trans>
                </HighlightText>
              </StyledH1>
              <P align='center' size='lg' weight='medium'>
                <Trans>Combining liquidity and security from Bitcoin and Ethereum. Mainnet live!</Trans>
              </P>
            </Flex>
            <Flex direction='column' gap='4xl' paddingX={{ base: 'none', md: '4xl' }}>
              <Flex direction='column' elementType='form' gap='s' onSubmit={handleSubmit}>
                <Suspense>
                  <ReferralInput
                    errorMessage={
                      referralCodeError
                        ? t(i18n)`Invalid referral code. You can try again, or proceed without one.`
                        : undefined
                    }
                    onChange={handleChange}
                  />
                </Suspense>
                <Button
                  color='primary'
                  loading={isPendingValidateReferralCode || isLoadingSignUp}
                  size='xl'
                  type='submit'
                >
                  <Trans>Start Harvesting Spice</Trans>
                </Button>
              </Flex>
              <Auditors />
              <Divider />
              <LoginSection />
            </Flex>
          </StyledAuthCard>
        </Flex>
      </Main>
    </Geoblock>
  );
};

export { SignUp };
