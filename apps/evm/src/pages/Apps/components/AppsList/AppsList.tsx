import { Flex, Tabs, TabsItem } from '@gobob/ui';

const AppsList = (): JSX.Element => {
  return (
    <Flex direction='column' gap='2xl'>
      <Tabs variant='without-background'>
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
    </Flex>
  );
};

export { AppsList };
