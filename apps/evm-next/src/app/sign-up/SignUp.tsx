'use client';

import { ChainId } from '@gobob/chains';
import { useConnectModal } from '@gobob/connect-ui';
import { useMutation } from '@gobob/react-query';
import { Button, Divider, Flex, P, toast } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FormEventHandler, Suspense, useEffect, useState } from 'react';

import { Auditors, HighlightText, ReferralInput } from './components';
import { StyledAuthCard, StyledH1 } from './SignUp.style';

import { Geoblock, LoginSection, Main } from '@/components';
import { L1_CHAIN, L2_CHAIN, RoutesPath, isValidChain } from '@/constants';
import { useGetUser, useSignUp } from '@/hooks';
import { signUpKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const SignUp = (): JSX.Element | null => {
  const { address, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();

  const router = useRouter();
  const t = useTranslations();
  const { data: user } = useGetUser({ retry: 5, retryDelay: 1000 });

  const [referalCode, setReferalCode] = useState('');

  const { mutate: signUp, isPending: isLoadingSignUp } = useSignUp();

  const {
    mutateAsync: validateReferralCodeAsync,
    error: referralCodeError,
    isPending: isPendingValidateReferralCode,
    reset
  } = useMutation({
    mutationKey: signUpKeys.referralCode(),
    mutationFn: async (code: string) => apiClient.postReferralCode(code)
  });

  useEffect(() => {
    if (user && address) {
      router.push(RoutesPath.FUSION);
    }
  }, [user, address, router]);

  const handleChange = (code: string) => {
    reset();
    setReferalCode(code);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (referalCode) {
      await validateReferralCodeAsync?.(referalCode);
    }

    if (!address) {
      return open({
        onConnectEvm: async ({ address, connector }) => {
          if (!address) return;
          if (!isValidChain((await connector?.getChainId()) as ChainId)) {
            const chain = await connector?.switchChain?.({ chainId: L2_CHAIN });

            if (!chain) {
              return toast.error('Something went wrong. Please try connecting your wallet again.');
            }
          }

          return signUp(address);
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync({ chainId: L1_CHAIN });
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
              <StyledH1 align='center' fontFamily='eurostar' weight='bold'>
                {t('home.title')}
                <br />
                <HighlightText display='block'>{t('home.subtitle')}</HighlightText>
              </StyledH1>
              <P align='center' size='lg' weight='medium'>
                {t('home.content')}
              </P>
            </Flex>
            <Flex direction='column' gap='4xl' paddingX={{ base: 'none', md: '4xl' }}>
              <Flex direction='column' elementType='form' gap='s' onSubmit={handleSubmit}>
                <Suspense>
                  <ReferralInput
                    errorMessage={
                      referralCodeError
                        ? 'Invalid referral code. You can try again, or proceed without one.'
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
                  {t('home.buttonLabel')}
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
