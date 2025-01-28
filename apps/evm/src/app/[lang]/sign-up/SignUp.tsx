'use client';

import { ChainId } from '@gobob/chains';
import { Button, Divider, Flex, P, toast } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { useParams, useRouter } from 'next/navigation';
import { FormEventHandler, Suspense, useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import { Auditors, HighlightText, ReferralInput } from './components';
import { StyledAuthCard, StyledH1 } from './SignUp.style';

import { chakraPetch } from '@/app/fonts';
import { Geoblock, LoginSection, Main } from '@/components';
import { useConnectModal } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN, RoutesPath, isValidChain } from '@/constants';
import { useGetUser, useSignUp } from '@/hooks';
import { fusionKeys } from '@/lib/react-query';
import { store } from '@/lib/store';
import { apiClient } from '@/utils';

const SignUp = (): JSX.Element | null => {
  const { address, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { i18n } = useLingui();

  const router = useRouter();
  const params = useParams();
  const { data: user } = useGetUser();

  const { token: turnstileToken } = useStore(store, (state) => state.shared.turnstile);

  const [referralCode, setReferralCode] = useState('');

  const { mutate: signUp, isPending: isLoadingSignUp } = useSignUp({
    onSuccess: () =>
      store.setState((s) => ({
        ...s,
        shared: {
          ...s.shared,
          turnstile: { isOpen: false }
        }
      }))
  });

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
    setReferralCode(code);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (referralCode) {
      await validateReferralCodeAsync?.(referralCode);
    }

    if (!address) {
      return open({
        onConnectEvm: async ({ address, connector }) => {
          if (!address) return;
          if (!isValidChain((await connector?.getChainId()) as ChainId)) {
            const chain = await connector?.switchChain?.({ chainId: L2_CHAIN });

            if (!chain) {
              return toast.error(<Trans>Something went wrong. Please try connecting your wallet again.</Trans>);
            }
          }

          if (!turnstileToken) {
            return store.setState((s) => ({
              ...s,
              shared: {
                ...s.shared,
                turnstile: { isOpen: true, onSuccess: (token) => signUp({ address, turnstileToken: token }) }
              }
            }));
          }

          return signUp({ address, turnstileToken });
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync({ chainId: L1_CHAIN });
    }

    if (!turnstileToken) {
      return store.setState((s) => ({
        ...s,
        shared: {
          ...s.shared,
          turnstile: { isOpen: true, onSuccess: (token) => signUp({ address, turnstileToken: token }) }
        }
      }));
    }

    return signUp({ address, turnstileToken });
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
