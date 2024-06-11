import { ChainId } from '@gobob/chains';
import { useConnectModal } from '@gobob/connect-ui';
import { Twitter } from '@gobob/icons';
import { useMutation, useQuery } from '@gobob/react-query';
import { Button, Card, Flex, H1, P, toast } from '@gobob/ui';
import { useAccount, useSignMessage, useSwitchChain } from '@gobob/wagmi';
import { useSessionStorage } from '@uidotdev/usehooks';
import { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SiweMessage } from 'siwe';

import { AuthCard, Geoblock, HighlightText, LoginSection, Main } from '../../components';
import { L1_CHAIN, RoutesPath, isValidChain } from '../../constants';
import { useGetUser } from '../../hooks';
import { apiClient } from '../../utils';

import { StyledAuthSection, StyledContainer } from './SignUp.style';

const SignUp = (): JSX.Element | null => {
  const { address, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const { open } = useConnectModal();

  let [searchParams, setSearchParams] = useSearchParams();
  const [isTwitterVisisted, setTwitterVisited] = useSessionStorage('isTwitterVisisted', false);

  const socialAuthToastId = useRef();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { refetch: refetchUser, data: user } = useGetUser({ retry: 5, retryDelay: 1000 });

  const {
    data: onboarding,
    isLoading: isLoadingOnboarding,
    refetch: refectOnboarding
  } = useQuery({
    queryKey: ['onboarding'],
    queryFn: async () => apiClient.getOnboarding(),
    refetchOnWindowFocus: false
  });

  const { mutate: signUp, isPending: isLoadingSignUp } = useMutation({
    mutationKey: ['signUp'],
    mutationFn: async (address: string) => {
      if (!chain) return;

      const nonce = await apiClient.getNonce();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        // TODO: we should define statement that will show up in the wallet when signing
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

      setTwitterVisited(false);
      navigate(RoutesPath.FUSION);
    },
    onError: async (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e?.message || 'Something went wrong. Please try again later.');
      }
    }
  });

  const hasReferralCode = onboarding?.referral_code;

  useEffect(() => {
    if (user && address) {
      navigate(RoutesPath.FUSION);
    }
  }, [user, address, navigate]);

  useEffect(() => {
    if (!socialAuthToastId.current && searchParams.get('twitterAuth') === 'failed') {
      setSearchParams({});

      socialAuthToastId.current = toast.error('Twitter account is already being used') as any;

      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingOnboarding) {
    return null;
  }

  if (!hasReferralCode) {
    return (
      <Main hasBackgroundImg maxWidth='3xl'>
        <Flex alignItems='center' flex={1} justifyContent='center' marginTop='4xl'>
          <AuthCard isLoadingReferralCode={isLoadingOnboarding} onValidReferralCode={() => refectOnboarding()} />
        </Flex>
      </Main>
    );
  }

  const isTwitterConnected = !!onboarding?.twitter;

  const handleLinkWallet = async () => {
    if (!isTwitterConnected) return;

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

    if (chain && !isValidChain(chain?.id)) {
      await switchChainAsync({ chainId: L1_CHAIN });
    }

    return signUp(address);
  };

  return (
    <Geoblock>
      <Main hasBackgroundImg maxWidth='3xl'>
        <Flex direction='column' gap='2xl' justifyContent='center'>
          <H1 align='center' fontFamily='eurostar' size='5xl' weight='bold'>
            <Trans components={{ highlight: <HighlightText /> }} i18nKey='signUp.title' />
          </H1>
          <P align='center' color='grey-100'>
            {t('signUp.subtitle')}
          </P>
          <P align='center' color='grey-100'>
            {t('signUp.content')}
          </P>
        </Flex>
        <StyledContainer alignItems='center' direction='column' justifyContent='center' marginTop='4xl'>
          <StyledAuthSection direction='column' elementType='ul' gap='4xl'>
            <Card alignSelf='stretch' elementType='li' gap='xl' padding='4xl'>
              <P size='s' weight='semibold'>
                1. {t('signUp.twitterStep')}
              </P>
              <Flex direction='column' gap='md'>
                <Button asChild color='primary' disabled={isTwitterConnected} variant='solid'>
                  <a href='api/auth/twitter/login'>
                    <Flex alignItems='center' elementType='span' gap='md'>
                      {isTwitterConnected ? t('signUp.connected') : t('signUp.connect')} <Twitter color='light' />
                    </Flex>
                  </a>
                </Button>
                <Button
                  asChild
                  color='primary'
                  disabled={!isTwitterConnected || isTwitterVisisted}
                  variant='solid'
                  onPress={() => setTwitterVisited(true)}
                >
                  <a href='https://twitter.com/build_on_bob' rel='noreferrer' target='_blank'>
                    <Flex alignItems='center' elementType='span' gap='md'>
                      {t('signUp.followBOB')} <Twitter color='light' />
                    </Flex>
                  </a>
                </Button>
              </Flex>
            </Card>
            <Card alignSelf='stretch' elementType='li' flex={1} gap='xl' padding='4xl'>
              <P size='s' weight='semibold'>
                2. {t('signUp.connectWallet')}
              </P>
              <Flex alignItems='center' direction='column' gap='xs'>
                <Button
                  fullWidth
                  color='primary'
                  disabled={isLoadingOnboarding || !isTwitterConnected || !isTwitterVisisted}
                  loading={isLoadingSignUp}
                  variant='solid'
                  onPress={handleLinkWallet}
                >
                  {t('signUp.linkWallet')}
                </Button>
              </Flex>
              <LoginSection direction='column' />
            </Card>
          </StyledAuthSection>
        </StyledContainer>
      </Main>
    </Geoblock>
  );
};

export { SignUp };
