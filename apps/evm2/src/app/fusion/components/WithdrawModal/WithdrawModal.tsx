import { Dd, Divider, Dl, DlGroup, Dt, Flex, H2, Modal, ModalBody, ModalHeader, ModalProps, P, Link } from '@gobob/ui';
import { useLocale } from '@gobob/ui';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { useMemo } from 'react';

import { useGetUser } from '@/hooks';
import { WithdrawForm } from '../WithdrawForm';
import { DepositedAssets } from '../UserStats/DepositedAssets';

type Props = {
  isSmartAccount?: boolean;
  onWithdrawalMutationComplete: () => void;
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type WithdrawModalProps = Props & InheritAttrs;

const WithdrawModal = ({ isSmartAccount, onClose, onWithdrawalMutationComplete, ...props }: WithdrawModalProps) => {
  const { data: user } = useGetUser();

  const { locale } = useLocale();

  const twitterMessage = useMemo(
    () =>
      `I harvested ${Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points || 0)} Spice during Season 1 of @build_on_bob Fusion.%0A%0ADon’t miss out on the massive opportunities of Season 2!%0A%0Ahttps://fusion.gobob.xyz/?refCode=${user?.referral_code}`,
    [locale, user?.leaderboardRank?.total_reward_points, user?.referral_code]
  );

  return (
    <Modal placement='top' {...props} onClose={onClose}>
      <ModalHeader>
        <Flex direction='column' gap='md'>
          <H2 align='center' size='md'>
            {t('fusion.withdrawModal.title')}
          </H2>
          <Divider />
        </Flex>
      </ModalHeader>
      <ModalBody gap='lg'>
        <P color='grey-50' size='s'>
          <Trans
            i18nKey='fusion.withdrawModal.summary'
            values={{
              totalSpice: Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points ?? 0),
              rank: user?.leaderboardRank.rank
            }}
          />
        </P>
        <P color='grey-50' size='s'>
          <Trans
            components={{
              xLink: (
                <Link
                  external
                  className='twitter-share-button'
                  href={`https://twitter.com/intent/tweet?text=${twitterMessage}`}
                  size='s'
                />
              )
            }}
            i18nKey='fusion.withdrawModal.share'
          />
        </P>
        <P color='grey-50' size='s'>
          {t('fusion.withdrawModal.seasonTwoDescription')}
        </P>
        <Dl justifyContent='space-between'>
          <DepositedAssets />
          <DlGroup alignItems='flex-start' direction='column' flex={0.5}>
            <Dt size='s' weight='semibold'>
              {t('fusion.withdrawModal.currentSpice')}
            </Dt>
            <Dd weight='bold'>{Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points ?? 0)}</Dd>
          </DlGroup>
        </Dl>
        <WithdrawForm
          isSmartAccount={isSmartAccount}
          onWithdrawalMutationComplete={() => onWithdrawalMutationComplete()}
        />
      </ModalBody>
    </Modal>
  );
};

export { WithdrawModal };
