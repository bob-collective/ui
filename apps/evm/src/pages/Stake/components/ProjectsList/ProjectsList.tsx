import { CardProps, Flex, Link, P, Table } from '@gobob/ui';

import { StyledSection } from './ProjectsList.style';
import { PellNetwork } from './PellNetwork';
import { SolvBTCBBN } from './SolvBTCBBN';
import { UniBTC } from './UniBTC';

type TransactionListProps = CardProps;

const projectsColumns = [
  { id: 'name', name: <P size='md'>Name</P> },
  { id: 'lst', name: <P size='md'>LST</P> },
  { id: 'apr', name: <P size='md'>APR</P> }
];

// NOTE: mock data
const projectsRows = [
  // {
  //   id: 1,
  //   name: (
  //     <Flex alignItems='center' gap='s'>
  //       <BTC />
  //       <P size='md'>SolvBTC</P>
  //     </Flex>
  //   ),
  //   lst: (
  //     <Link external href='#' size='md' underlined='always'>
  //       0x21...314s
  //     </Link>
  //   ),
  //   apr: <P size='md'>3.00%</P>
  // },
  {
    id: 2,
    name: (
      <Flex alignItems='center' gap='s'>
        <SolvBTCBBN />
        <P size='md'>SolvBTC.BBN</P>
      </Flex>
    ),
    lst: (
      <Link external href='#' size='md' underlined='always'>
        0xa1...5K41
      </Link>
    ),
    apr: <P size='md'>3.00%</P>
  },
  {
    id: 3,
    name: (
      <Flex alignItems='center' gap='s'>
        <UniBTC />
        <P size='md'>uniBTC</P>
      </Flex>
    ),
    lst: (
      <Link external href='#' size='md' underlined='always'>
        0x31...f421
      </Link>
    ),
    apr: <P size='md'>2.21%</P>
  },
  {
    id: 4,
    name: (
      <Flex alignItems='center' gap='s'>
        <PellNetwork />
        <P size='md'>Pell Network</P>
      </Flex>
    ),
    lst: '',
    apr: <P size='md'>7.00%</P>
  }
];

const ProjectsList = (props: TransactionListProps): JSX.Element => {
  // const { address, chain } = useAccount();
  // const { data: transactions, isInitialLoading } = useGetTransactions();

  // const explorerUrl = (chain || chainL2).blockExplorers?.default.url;

  return (
    <StyledSection gap='xl' padding='none' {...props}>
      <Table columns={projectsColumns} rows={projectsRows} />
    </StyledSection>
  );
};

export { ProjectsList };
