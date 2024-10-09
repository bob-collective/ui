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
import { useTranslation } from 'react-i18next';

import { VotingAppData } from '../../hooks';
import { SpiceChip } from '../SpiceChip';

import { StyledCardHeader, StyledCategoryList, StyledSocialsWrapper, StyledSpiceChipWrapper } from './AppCard.style';

type Props = {
  name: string;
  description?: string;
  categories?: string[];
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
  const { t } = useTranslation();

  return (
    <Card
      {...props}
      disableAnimation
      isPressable
      aria-label={`navigate to ${name} app page`}
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
      <Flex direction='column' paddingX='xl' paddingY='lg'>
        <Dl direction='column' gap='xxs'>
          <DlGroup justifyContent='space-between'>
            <Dd color='grey-50'>{t('apps.list.card.spicePerHour')}</Dd>
            <Dt color='grey-50'>{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerHour)}</Dt>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dd color='grey-50'>{t('apps.list.card.spiceMultiplier')}</Dd>
            <Dt color='grey-50'>{spiceMultiplier}</Dt>
          </DlGroup>
          {userHarvest !== undefined && (
            <DlGroup justifyContent='space-between'>
              <Dd color='grey-50'>{t('apps.list.card.harvest')}</Dd>
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
          <>
            <Divider marginY='lg' />
            <StyledCategoryList gap='md'>
              {categories?.map((category, idx) => (
                <Chip key={idx} background='grey-300'>
                  {category}
                </Chip>
              ))}
            </StyledCategoryList>
          </>
        )}
      </Flex>
    </Card>
  );
};

export { AppCard };
