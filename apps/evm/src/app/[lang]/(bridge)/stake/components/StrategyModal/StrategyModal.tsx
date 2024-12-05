import { PellNetwork } from '@gobob/icons';
import { Modal, ModalHeader, Flex, Avatar, ModalBody, Dl, DlGroup, Dd, Dt, Divider, Span } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Link } from '@gobob/ui';
import { truncateUrl } from '@gobob/utils';

import { StakingForm } from '../StakeForm';
import { StrategyData } from '../../hooks';

import { StyledCard, StyledFlex } from './StrategyModal.style';

import { chainL2 } from '@/constants';

interface Props {
  onStakeSuccess: () => void;
  strategy: StrategyData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stakingInfo: any;
  onCloseModal: () => void;
}

const StrategyModal = ({ strategy, stakingInfo, onStakeSuccess, onCloseModal }: Props) => {
  return (
    <Modal isOpen={!!strategy} size='4xl' onClose={onCloseModal}>
      <StyledCard>
        <ModalHeader>
          <Flex direction='column' gap='lg'>
            <Flex alignItems='center' gap='lg'>
              {strategy.raw.integration.logo ? (
                <Avatar size={'4xl'} src={strategy.raw.integration.logo} />
              ) : (
                <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
              )}
              <Flex alignItems='flex-start' direction='column'>
                <Span size='lg'>{stakingInfo.strategy}</Span>
                <Span color='grey-50' size='md' weight='medium'>
                  {stakingInfo.protocol}
                </Span>
              </Flex>
            </Flex>
            {stakingInfo?.about}
          </Flex>
        </ModalHeader>
        <ModalBody>
          <StyledFlex direction={{ base: 'column', md: 'row' }} gap='xl'>
            <StakingForm strategy={strategy} onStakeSuccess={onStakeSuccess} />
            <StyledFlex direction='column' gap='xl'>
              <Dl direction='column' gap='lg'>
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md' style={{ minWidth: '15ch' }}>
                    <Trans>Input Token</Trans>
                  </Dd>
                  <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>{stakingInfo?.inputToken}</Dt>
                </DlGroup>
                <Divider />
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md' style={{ minWidth: '15ch' }}>
                    <Trans>Output Token</Trans>
                  </Dd>
                  <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                    {strategy?.raw.outputToken ? (
                      <Link
                        external
                        color='grey-50'
                        href={new URL(
                          `/address/${strategy?.raw.outputToken?.address}`,
                          chainL2.blockExplorers?.default.url
                        ).toString()}
                        size='md'
                        underlined='always'
                      >
                        {stakingInfo?.outputToken}
                      </Link>
                    ) : (
                      stakingInfo?.outputToken
                    )}
                  </Dt>
                </DlGroup>
                {stakingInfo?.securityReview && (
                  <>
                    <Divider />
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        <Trans>Security Review by Bitcoin Layers</Trans>
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        <Link external color='grey-50' href={stakingInfo?.securityReview} size='md' underlined='always'>
                          {truncateUrl(stakingInfo?.securityReview)}
                        </Link>
                      </Dt>
                    </DlGroup>
                  </>
                )}
                <Divider />
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md' style={{ minWidth: '15ch' }}>
                    <Trans>Website</Trans>
                  </Dd>
                  <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                    <Link external color='grey-50' href={stakingInfo?.website} size='md' underlined='always'>
                      {truncateUrl(stakingInfo?.website)}
                    </Link>
                  </Dt>
                </DlGroup>
              </Dl>
            </StyledFlex>
          </StyledFlex>
        </ModalBody>
      </StyledCard>
    </Modal>
  );
};

export { StrategyModal };
