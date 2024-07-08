import { ChainId } from '@gobob/chains';

const bundler = {
  [ChainId.BASE_SEPOLIA]: `https://api.pimlico.io/v2/84532/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`,
  [ChainId.BOB]: `https://api.pimlico.io/v2/60808/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`
};

const getBundlerByChainId = (chainId: ChainId) => {
  return bundler[chainId as ChainId.BOB];
};

export { getBundlerByChainId };
