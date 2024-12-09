import { ChainId } from '@gobob/chains';
import { FlexProps } from '@gobob/ui';
import { ReactNode } from 'react';

import { ChainLogo } from '../ChainLogo';
import { ChainLogoProps } from '../ChainLogo/ChainLogo';

import { StyledChain, StyledWrapper } from './ChainAsset.style';

type Props = {
  chainId: ChainId | 'BTC';
  asset: ReactNode;
  chainProps: Omit<ChainLogoProps, 'chainId'>;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ChainAssetProps = Props & InheritAttrs;

const ChainAsset = ({ asset, chainId, chainProps, ...props }: ChainAssetProps) => (
  <StyledWrapper elementType='span' {...props}>
    {asset}
    <StyledChain>
      <ChainLogo chainId={chainId} {...chainProps} />
    </StyledChain>
  </StyledWrapper>
);

export { ChainAsset };
