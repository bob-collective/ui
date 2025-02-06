import { Icon, Skeleton, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { StrategyData } from '../../hooks';

const BannerImage = ({ strategy }: { strategy: StrategyData | undefined }) => {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));

  const InputTokenIcon = strategy?.info.breakdown.at(0)?.icon as typeof Icon;
  const OutputTokenIcon = strategy?.info.breakdown.at(-1)?.icon as typeof Icon;

  return (
    <>
      {strategy ? (
        <OutputTokenIcon
          height={25}
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            bottom: 20,
            right: 170,
            filter: 'blur(2px)'
          }}
          width={25}
        />
      ) : (
        <Skeleton
          height='25px'
          rounded='full'
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            bottom: 20,
            right: 170,
            filter: 'blur(2px)'
          }}
          width='25px'
        />
      )}
      {strategy ? (
        <InputTokenIcon
          height={25}
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: 30,
            right: 200,
            filter: 'blur(2px)'
          }}
          width={25}
        />
      ) : (
        <Skeleton
          height='25px'
          rounded='full'
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: 30,
            right: 200,
            filter: 'blur(2px)'
          }}
          width='25px'
        />
      )}
      {strategy ? (
        <InputTokenIcon
          height={50}
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: -10,
            right: 0,
            filter: 'blur(2px)'
          }}
          width={50}
        />
      ) : (
        <Skeleton
          height='50px'
          rounded='full'
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: -10,
            right: 0,
            filter: 'blur(2px)'
          }}
          width='50px'
        />
      )}
      {strategy ? (
        <InputTokenIcon
          height={90}
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: '50%',
            right: 80,
            transform: 'translateY(-50%)'
          }}
          width={90}
        />
      ) : (
        <Skeleton
          height='90px'
          rounded='full'
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: '50%',
            right: 80,
            transform: 'translateY(-50%)'
          }}
          width='90px'
        />
      )}
      {strategy ? (
        <OutputTokenIcon
          height={90}
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: 'translateY(-50%)'
          }}
          width={90}
        />
      ) : (
        <Skeleton
          height='90px'
          rounded='full'
          style={{
            opacity: isMobileViewport ? 0.2 : 1,
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: 'translateY(-50%)'
          }}
          width='90px'
        />
      )}
    </>
  );
};

export { BannerImage };
