'use client';

import { ChainId } from '@gobob/chains';
import { useConnectModal } from '@gobob/connect-ui';
import { useMutation } from '@gobob/react-query';
import { Button, Divider, Flex, P, toast } from '@gobob/ui';
import { useAccount, useSignMessage, useSwitchChain } from '@gobob/wagmi';
import { FormEventHandler, Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { SiweMessage } from 'siwe';

import { Auditors, HighlightText, ReferralInput } from './components';
import { StyledAuthCard, StyledH1 } from './SignUp.style';

import { Geoblock, LoginSection, Main } from '@/components';
import { L1_CHAIN, RoutesPath, isValidChain } from '@/constants';
import { useGetUser } from '@/hooks';
import { signUpKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const SignUp = (): JSX.Element | null => {
  const { address, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const { open } = useConnectModal();

  const router = useRouter();
  const t = useTranslations();
  const { refetch: refetchUser, data: user } = useGetUser({ retry: 5, retryDelay: 1000 });

  const [referalCode, setReferalCode] = useState('');

  const { mutate: signUp, isPending: isLoadingSignUp } = useMutation({
    mutationKey: signUpKeys.signUp(),
    mutationFn: async (address: string) => {
      if (!chain) return;

      const nonce = await apiClient.getNonce();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to BOB Fusion',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: nonce
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage()
      });

      const res = await apiClient.signUp(message, signature);

      if (!res.ok) throw new Error(res?.message || 'Error verifying message');
    },
    onSuccess: async () => {
      await refetchUser();

      router.push(RoutesPath.FUSION);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: async (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e?.message || 'Something went wrong. Please try again later.');
      }
    }
  });

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

  const handleLinkWallet = async () => {
    if (!address) {
      return open({
        onConnectEvm: async ({ address, connector }) => {
          if (!address) return;
          if (!isValidChain((await connector?.getChainId()) as ChainId)) {
            const chain = await connector?.switchChain?.({ chainId: L1_CHAIN });

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

  const handleChange = (code: string) => {
    reset();
    setReferalCode(code);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (referalCode) {
      await validateReferralCodeAsync?.(referalCode);
    }

    handleLinkWallet();
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
