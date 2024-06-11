import { Flex } from '@gobob/ui';

import { ExternalBridgeCard } from './ExternalBridgeCard';

type ExternalBridgeFormProps = {
  type: 'deposit' | 'withdraw';
};

const ExternalBridgeForm = ({ type }: ExternalBridgeFormProps): JSX.Element => {
  // const { data: tokens } = useTokens(chainId);

  // const [token, setToken] = useState<string>(NATIVE[chainId].symbol);

  // const items: Array<{ ticker: string; logoUrl: string }> = useMemo(
  //   () =>
  //     tokens?.map((token) => {
  //       return {
  //         ticker: token.currency.symbol,
  //         logoUrl: token.raw.logoUrl
  //       };
  //     }) || [],
  //   [tokens]
  // );

  return (
    <Flex direction='column' gap='xl' marginTop='2xl'>
      {/* <Select
        items={items}
        label='Token to Bridge'
        modalProps={{ title: 'Select Token', size: 'xs' }}
        size='lg'
        type='modal'
        value={token}
        onSelectionChange={(key) => setToken(key as string)}
      >
        {(data: { ticker: string; logoUrl: string }) => (
          <Item key={data.ticker} textValue={data.ticker}>
            <Flex alignItems='center' gap='md'>
              <Avatar size='3xl' src={data.logoUrl} /> <P style={{ color: 'inherit' }}>{data.ticker}</P>
            </Flex>
          </Item>
        )}
      </Select> */}
      <Flex direction='column' gap='md'>
        <ExternalBridgeCard bridge='relay' type={type} />
        <ExternalBridgeCard bridge='meson' type={type} />
        <ExternalBridgeCard bridge='orbiter-finance' type={type} />
        <ExternalBridgeCard bridge='owlto-finance' type={type} />
        <ExternalBridgeCard bridge='stargate' type={type} />
      </Flex>
    </Flex>
  );
};

export { ExternalBridgeForm };
