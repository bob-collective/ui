import { ChainId } from '@gobob/chains';
import { FlexProps } from '@gobob/ui';
import { ReactNode } from 'react';

import { ChainLogo } from '../ChainLogo';
import { ChainLogoProps } from '../ChainLogo/ChainLogo';

import { StyledChain, StyledWrapper } from './ChainAsset.style';

type Props = {
  chainId: ChainId | 'BTC';
  asset: ReactNode;
  chainProps?: Omit<ChainLogoProps, 'chainId'>;
  chainLogo?: ReactNode;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ChainAssetProps = Props & InheritAttrs;

const ChainAsset = ({ asset, chainId, chainLogo, chainProps, ...props }: ChainAssetProps) => (
  <StyledWrapper elementType='span' {...props}>
    {asset}
    <StyledChain>{chainLogo || <ChainLogo chainId={chainId} {...chainProps} />}</StyledChain>
  </StyledWrapper>
);

export { ChainAsset };
