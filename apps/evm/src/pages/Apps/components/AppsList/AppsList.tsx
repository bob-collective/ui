import { Flex, H2, Tabs, TabsItem } from '@gobob/ui';

import { AppCard } from './AppCard';
import { StyledGrid } from './AppsList.style';

const apps = [
  {
    categories: ['Lending & Borrow', 'DeFi', 'DEX'],
    description: 'Velodrome Finance is a next-generation AMM that combines',
    imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
    name: 'Velodrome',
    refCode: '123',
    socials: [
      { url: '#', name: 'discord' },
      { name: 'x', url: '#' }
    ],
    spiceMultiplier: 2,
    spicePerHour: 20000,
    totalSpice: 2000000,
    url: '#',
    userHarvest: 2000
  },
  {
    categories: ['Lending & Borrow', 'DeFi', 'DEX'],
    description: 'Velodrome Finance is a next-generation AMM that combines',
    imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
    name: 'Velodrome',
    refCode: '123',
    socials: [
      { url: '#', name: 'discord' },
      { name: 'x', url: '#' }
    ],
    spiceMultiplier: 2,
    spicePerHour: 20000,
    totalSpice: 2000000,
    url: '#',
    userHarvest: 2000
  },
  {
    categories: ['Lending & Borrow', 'DeFi', 'DEX'],
    description: 'Velodrome Finance is a next-generation AMM that combines',
    imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
    name: 'Velodrome',
    refCode: '123',
    socials: [
      { url: '#', name: 'discord' },
      { name: 'x', url: '#' }
    ],
    spiceMultiplier: 2,
    spicePerHour: 20000,
    totalSpice: 2000000,
    url: '#',
    userHarvest: 2000
  }
];

const AppsList = (): JSX.Element => {
  return (
    <Flex direction='column' gap='3xl' marginTop='3xl'>
      <H2 size='3xl'>Discover all Apps</H2>
      <Tabs variant='light'>
        <TabsItem key='all' title='All Categories'>
          <></>
        </TabsItem>
        <TabsItem key='new-dapps' title='New Apps'>
          <></>
        </TabsItem>
        <TabsItem key='defi' title='DeFi'>
          <></>
        </TabsItem>
        <TabsItem key='lending-borrowing' title='Lending & Borrowing'>
          <></>
        </TabsItem>
        <TabsItem key='dex' title='Dex'>
          <></>
        </TabsItem>
        <TabsItem key='bridge' title='Bridge'>
          <></>
        </TabsItem>
        <TabsItem key='nft' title='NFT'>
          <></>
        </TabsItem>
        <TabsItem key='my-harvesters' title='My Harvesters'>
          <></>
        </TabsItem>
      </Tabs>
      <StyledGrid>
        {apps.map((app) => (
          <AppCard key={app.refCode} {...(app as any)} />
        ))}
      </StyledGrid>
    </Flex>
  );
};

export { AppsList };
