import {
  Table,
  Modal,
  Flex,
  Avatar,
  InformationCircle,
  Tooltip,
  Button,
  ArrowLongRight,
  ModalHeader,
  ModalBody,
  P,
  Dl,
  Dd,
  DlGroup,
  Dt,
  Divider,
  Link
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PellNetwork } from '@gobob/icons';
import { truncateEthAddress } from '@gobob/utils';
import { ChainId } from '@gobob/chains';

import { StyledFlex, StyledCard } from '../../Stake.style';
import { StakingForm } from '../StakeForm';
import { StrategyData, useGetStakingStrategies } from '../../hooks';

import { chainL2 } from '@/constants';
import { Chain } from '@/components';

enum StakeTableColumns {
  PRODUCT = 'product',
  BRIDGE = 'bridge',
  CATEGORY = 'category',
  INCENTIVES = 'incentives',
  ACTION = 'action'
}

type StakeTableRow = {
  id: string;
  [StakeTableColumns.PRODUCT]: ReactNode;
  [StakeTableColumns.BRIDGE]: ReactNode;
  [StakeTableColumns.INCENTIVES]: ReactNode;
  [StakeTableColumns.CATEGORY]: ReactNode;
  [StakeTableColumns.ACTION]: ReactNode;
};

const columns = [
  { name: <Trans>Product</Trans>, id: StakeTableColumns.PRODUCT },
  { name: <Trans>Incentives</Trans>, width: 240, id: StakeTableColumns.INCENTIVES },
  { name: <Trans>Route</Trans>, id: StakeTableColumns.BRIDGE },
  { name: <Trans>Category</Trans>, id: StakeTableColumns.CATEGORY },
  { name: <Trans>Action</Trans>, id: StakeTableColumns.ACTION }
];

const stakingInfo = {
  'bedrock-unibtc': {
    shortName: 'Bedrock',
    category: <Trans>Liquid Staking</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> uniBTC
      </>
    ),
    incentives: <Trans>Spice + Bedrock Diamonds + Babylon Points</Trans>,
    about: (
      <Trans>
        <Link external color='grey-50' href='https://app.bedrock.technology/unibtc' size='md' underlined='always'>
          uniBTC
        </Link>{' '}
        represents the staked wBTC plus all future staking rewards and accrual of Babylon staking rewards and Bedrock
        diamonds
      </Trans>
    )
  },
  'pell-solvbtcbbn': {
    shortName: 'Pell',
    category: <Trans>Restaking</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> SolvBTC.BBN
      </>
    ),
    incentives: <Trans>Spice + Pell Points + Solv XP + Babylon Points</Trans>,
    about: (
      <Trans>
        {' '}
        <Link external color='grey-50' href='https://app.pell.network/restake' size='md' underlined='always'>
          Restake SolvBTC.BBN into Pell
        </Link>{' '}
        to secure actively validated services via proof of stake mechanism.
      </Trans>
    )
  },
  'pell-unibtc': {
    shortName: 'Pell',
    category: <Trans>Restaking</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> uniBTC
      </>
    ),
    incentives: <Trans>Spice + Pell Points + Bedrock Diamond + Babylon Points</Trans>,
    about: (
      <Trans>
        {' '}
        <Link external color='grey-50' href='https://app.pell.network/restake' size='md' underlined='always'>
          Restake uniBTC into Pell
        </Link>{' '}
        to secure actively validated services via proof of stake mechanism.
      </Trans>
    )
  },
  'segment-tbtc': {
    shortName: 'Segment',
    category: <Trans>Lending</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} /> tBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    about: (
      <Trans>
        <Link external color='grey-50' href='https://app.segment.finance/#/' size='md' underlined='always'>
          Supply tBTC into Segment
        </Link>{' '}
        to earn interest.
      </Trans>
    )
  },
  'segment-wbtc': {
    shortName: 'Segment',
    category: <Trans>Lending</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> wBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    about: (
      <Trans>
        <Link external color='grey-50' href='https://app.segment.finance/#/' size='md' underlined='always'>
          Supply wBTC into Segment
        </Link>{' '}
        to earn interest.
      </Trans>
    )
  },
  'segment-sesolvbtcbbn': {
    shortName: 'Segment',
    category: <Trans>Lending</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> seSOLVBTCBBN
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR + Solv XP + Babylon Points</Trans>,
    about: (
      <Trans>
        <Link external color='grey-50' href='https://app.segment.finance/#/' size='md' underlined='always'>
          Supply seSOLVBTCBBN into Segment
        </Link>{' '}
        to earn interest.
      </Trans>
    )
  },
  'segment-seunibtc': {
    shortName: 'Segment',
    category: <Trans>Lending</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> seUNIBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR + Bedrock Diamonds + Babylon Points</Trans>,
    about: (
      <Trans>
        <Link external color='grey-50' href='https://app.segment.finance/#/' size='md' underlined='always'>
          Supply seUNIBTC into Segment
        </Link>{' '}
        to earn interest.
      </Trans>
    )
  },
  'solv-solvbtcbbn': {
    shortName: 'Solv',
    category: <Trans>Liquid Staking</Trans>,
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> SolvBTC.BBN
      </>
    ),
    incentives: <Trans>Spice + Solv XP + Babylon Points</Trans>,
    about: (
      <Trans>
        <Link
          external
          color='grey-50'
          href='https://app.solv.finance/babylon?network=bob'
          size='md'
          underlined='always'
        >
          SolvBTC.BBN
        </Link>{' '}
        is a yield-bearing token that represents staked SolvBTC plus all future Babylon staking rewards and Solv Points.
      </Trans>
    )
  }
};

const stakingInfoAny = stakingInfo as Record<string, (typeof stakingInfo)[keyof typeof stakingInfo] | undefined>;

interface Props {
  searchParams?: { receive: string };
}

const StakeTable = ({ searchParams }: Props) => {
  const [strategy, setStrategy] = useState<StrategyData>();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const { data: strategies = [] } = useGetStakingStrategies();

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const validStrategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    setStrategy(validStrategy);
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = strategies.map((strategy, idx) => {
    return {
      id: `${strategy.raw.id}${idx}`,
      [StakeTableColumns.PRODUCT]: (
        <Flex alignItems='center' gap='lg'>
          {strategy.raw.integration.logo ? (
            <Avatar size={'2xl'} src={strategy.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
          )}
          <>{stakingInfoAny[strategy?.raw.integration.slug ?? '']?.shortName}</>
          <Tooltip color='primary' label={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.about}>
            <InformationCircle color='grey-50' size='xs' />
          </Tooltip>
        </Flex>
      ),
      [StakeTableColumns.BRIDGE]: (
        <Flex alignItems='center' gap='lg'>
          <>{stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategy}</>
        </Flex>
      ),
      [StakeTableColumns.CATEGORY]: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.category,
      [StakeTableColumns.INCENTIVES]: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives,
      [StakeTableColumns.ACTION]: (
        <Button color='primary' onPress={() => setStrategy(strategy)}>
          Stake
        </Button>
      )
    };
  });

  return (
    <>
      <Table columns={columns} rows={rows} />
      {strategy && (
        <Modal isOpen={!!strategy} size='4xl' onClose={() => setStrategy(undefined)}>
          <StyledCard>
            <ModalHeader>
              <Flex direction='column' gap='lg'>
                <Flex alignItems='center' gap='lg'>
                  {strategy.raw.integration.logo ? (
                    <Avatar size={'4xl'} src={strategy.raw.integration.logo} />
                  ) : (
                    <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
                  )}
                  {strategy.raw.integration.name}
                </Flex>
                <P>{stakingInfoAny[strategy?.raw.integration.slug ?? '']?.about}</P>
              </Flex>
            </ModalHeader>
            <ModalBody>
              <StyledFlex direction='row' gap='xl'>
                <StyledFlex>
                  <StakingForm
                    strategy={strategy}
                    onStakeSuccess={() => {
                      return null;
                    }}
                  />
                </StyledFlex>
                <StyledFlex direction='column' gap='xl'>
                  <Dl direction='column' gap='lg'>
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        Category
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.category ?? '~'}
                      </Dt>
                    </DlGroup>
                    <Divider />
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        Incentives
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives}
                      </Dt>
                    </DlGroup>
                    <Divider />
                    {strategy?.raw.outputToken && (
                      <DlGroup alignItems='center' justifyContent='space-between'>
                        <Dd size='md' style={{ minWidth: '15ch' }}>
                          Staking Token
                        </Dd>
                        <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
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
                            {truncateEthAddress(strategy?.raw.outputToken?.address)}
                          </Link>
                        </Dt>
                      </DlGroup>
                    )}
                  </Dl>
                </StyledFlex>
              </StyledFlex>
            </ModalBody>
          </StyledCard>
        </Modal>
      )}
    </>
  );
};

export { StakeTable };
