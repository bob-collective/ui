import { Discord, Spice, Twitter } from '@gobob/icons';
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
  Span,
  useLocale
} from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { VotingAppData } from '../../hooks';
import { SpiceChip } from '../SpiceChip';

import { StyledCardHeader, StyledCategoryList, StyledSocialsWrapper, StyledSpiceChipWrapper } from './AppCard.style';

type Props = {
  name: string;
  description?: string;
  categories?: string[];
  incentives: string[];
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
  incentives,
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
  const { i18n } = useLingui();

  return (
    <Card
      {...props}
      disableAnimation
      isPressable
      aria-label={t(i18n)`navigate to ${name} app page`}
      borderColor='grey-300'
      flex={1}
      padding='none'
    >
      <StyledCardHeader gap='lg' paddingX='xl' paddingY='3xl'>
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
        <Avatar borderColor='grey-300' rounded='md' size='9xl' src={imgSrc} />
        <Flex direction='column' justifyContent='center'>
          <H3 size='lg'>{name}</H3>
          {description && (
            <P color='grey-50' rows={3} size='s'>
              {description}
            </P>
          )}
        </Flex>
        <StyledSocialsWrapper alignItems='center' gap='lg'>
          {discord && (
            <Link external href={`https://${discord}`}>
              <Discord color='grey-50' size='s' />
            </Link>
          )}
          {twitter && (
            <Link external href={`https://${twitter}`}>
              <Twitter color='grey-50' size='xs' />
            </Link>
          )}
        </StyledSocialsWrapper>
      </StyledCardHeader>
      <Divider />
      <Flex direction='column' flex={1} justifyContent='space-between' paddingX='xl' paddingY='lg'>
        <Dl direction='column' gap='xxs'>
          <DlGroup justifyContent='space-between'>
            <Dd color='grey-50'>
              <Trans>Spice Per Hour</Trans>
            </Dd>
            <Dt color='grey-50'>{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerHour)}</Dt>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dd color='grey-50'>
              <Trans>Spice Multiplier</Trans>
            </Dd>
            <Dt color='grey-50'>{spiceMultiplier}</Dt>
          </DlGroup>
          {!!incentives.length && (
            <DlGroup alignItems='flex-start' gap='xl' justifyContent='space-between'>
              <Dd color='grey-50'>
                <Trans>Rewards</Trans>
              </Dd>
              <Flex wrap elementType='dt' gap='s'>
                {incentives.map((incentive, idx) => (
                  <Chip key={idx} background='grey-800' borderColor='primary-500' size='s'>
                    {incentive}
                  </Chip>
                ))}
              </Flex>
            </DlGroup>
          )}
          {userHarvest !== undefined && (
            <DlGroup justifyContent='space-between'>
              <Dd color='grey-50'>
                <Trans>My Total Harvest</Trans>
              </Dd>
              <Flex alignItems='center' gap='xs'>
                <Spice color='primary-400' size='xs' />
                <Span color='primary-400'>
                  {Intl.NumberFormat(locale, { notation: 'compact' }).format(userHarvest || 0)}
                </Span>
              </Flex>
            </DlGroup>
          )}
        </Dl>
        {categories && (
          <Flex direction='column'>
            <Divider marginY='lg' />
            <StyledCategoryList gap='md'>
              {categories?.map((category, idx) => (
                <Chip key={idx} background='grey-300'>
                  {category}
                </Chip>
              ))}
            </StyledCategoryList>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

export { AppCard };
