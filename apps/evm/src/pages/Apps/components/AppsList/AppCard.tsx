import { Spice, Twitter } from '@gobob/icons';
import {
  Avatar,
  Card,
  CardProps,
  Chip,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  H3,
  Link,
  P,
  SolidShieldCheck,
  useLocale
} from '@gobob/ui';

import { VotingAppData } from '../../hooks';
import { SpiceChip } from '../SpiceChip';

import { StyledImgWrapper, StyledSpiceChipWrapper } from './AppCard.style';

type Props = {
  name: string;
  description?: string;
  categories?: string[];
  url: string;
  imgSrc: string;
  spicePerHour: number;
  spiceMultiplier: string;
  userHarvest?: number;
  discord?: string;
  twitter?: string;
  voting?: VotingAppData;
  onVote?: (app: VotingAppData) => void;
  isVotingDisabled?: boolean;
  isVotingExceeded?: boolean;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppCardPops = Props & InheritAttrs;

const AppCard = ({
  name,
  description,
  categories,
  url,
  imgSrc,
  voting,
  spicePerHour,
  spiceMultiplier,
  userHarvest,
  discord,
  twitter,
  onVote,
  isVotingDisabled,
  isVotingExceeded,
  ...props
}: AppCardPops): JSX.Element => {
  const { locale } = useLocale();

  return (
    <a href={`https://${url}`} rel='noreferrer' style={{ textDecoration: 'none', display: 'flex' }} target='_blank'>
      <Card {...props} borderColor='grey-300' flex={1} padding='none'>
        <StyledImgWrapper alignItems='center' justifyContent='center' padding='5xl'>
          <Avatar borderColor='grey-300' rounded='md' size='9xl' src={imgSrc} />
          {voting && (
            <StyledSpiceChipWrapper>
              <SpiceChip
                amount={voting.weight}
                iconPlacement='end'
                isDisabled={isVotingDisabled}
                isLit={voting.userHasVotedFor}
                isVotingExceeded={isVotingExceeded}
                onPress={() => onVote?.(voting)}
              />
            </StyledSpiceChipWrapper>
          )}
        </StyledImgWrapper>
        <Divider />
        <Flex direction='column' padding='xl'>
          <Flex direction='column' gap='xl'>
            <Flex flex={1} gap='s' justifyContent='space-between'>
              <H3 size='lg'>{name}</H3>
              <Flex alignItems='center' flex='0' gap='md'>
                <SolidShieldCheck color='grey-50' size='s' />
                {discord && (
                  <Link external href={discord}>
                    <Twitter color='grey-50' size='s' />
                  </Link>
                )}
                {twitter && (
                  <Link external href={twitter}>
                    <Twitter color='grey-50' size='s' />
                  </Link>
                )}
              </Flex>
            </Flex>
            {description && (
              <P color='grey-50' rows={2} size='s'>
                {description}
              </P>
            )}
            <Dl direction='column' gap='xxs'>
              <DlGroup justifyContent='space-between'>
                <Dd color='grey-50'>Spice Per Hour</Dd>
                <Dt color='grey-50'>{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerHour)}</Dt>
              </DlGroup>
              <DlGroup justifyContent='space-between'>
                <Dd color='grey-50'>Spice Multiplier</Dd>
                <Dt color='grey-50'>{spiceMultiplier}</Dt>
              </DlGroup>
              {userHarvest !== undefined && (
                <DlGroup justifyContent='space-between'>
                  <Dd color='grey-50'>My Total Harvest</Dd>
                  <Dt color='primary-400' style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Spice color='inherit' size='xs' />
                    {Intl.NumberFormat(locale, { notation: 'compact' }).format(userHarvest || 0)}
                  </Dt>
                </DlGroup>
              )}
            </Dl>
          </Flex>
          {categories && (
            <>
              <Divider marginY='xl' />
              <Flex gap='md' style={{ overflow: 'hidden' }}>
                {categories?.map((category, idx) => (
                  <Chip key={idx} background='grey-300'>
                    {category}
                  </Chip>
                ))}
              </Flex>
            </>
          )}
        </Flex>
      </Card>
    </a>
  );
};

export { AppCard };
