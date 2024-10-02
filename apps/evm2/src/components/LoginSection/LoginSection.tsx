import { toast } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Button, Flex, FlexProps, P } from '@gobob/ui';
import { useTranslation } from 'next-i18next';
import { useConnectModal } from '@gobob/connect-ui';

import { L1_CHAIN, isValidChain } from '@/constants';
import { useGetUser, useLogin } from '@/hooks';

type Props = {};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type LoginSectionProps = Props & InheritAttrs;

const LoginSection = ({ direction = { base: 'column', md: 'row' }, ...props }: LoginSectionProps): JSX.Element => {
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { refetch: refetchUser } = useGetUser({ retry: 5, retryDelay: 1000 });
  const { address, chain } = useAccount();

  const { t } = useTranslation();

  const { mutate: login, isPending: isLoadingLogin } = useLogin({
    onSuccess: async () => {
      refetchUser();
    },
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e.message || 'Something went wrong. Please try again later.');
      }
    }
  });

  const handlePress = async () => {
    if (!address) {
      return open();
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync?.({ chainId: L1_CHAIN });
    }

    return login(address);
  };

  return (
    <Flex alignItems='center' direction={direction} gap='xs' justifyContent='center' {...props}>
      <P size='s' weight='bold'>
        {t('home.loginLabel')}
      </P>
      <Button color='primary' loading={isLoadingLogin} size='s' variant='ghost' onPress={handlePress}>
        {t('home.loginButtonText')}
      </Button>
    </Flex>
  );
};

export { LoginSection };
