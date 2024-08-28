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
  SolidShieldCheck,
  useLocale
} from '@gobob/ui';

import { StyledImgWrapper, StyledSpiceChip } from './AppCard.style';

type CardSocials = 'discord' | 'x';

const socialsMap: Record<CardSocials, typeof Twitter> = {
  x: Twitter,
  discord: Discord
};

type Props = {
  name: string;
  description: string;
  refCode: string;
  categories: string[];
  url: string;
  imgSrc: string;
  totalSpice: number;
  spicePerHour: number;
  spiceMultiplier: number;
  userHarvest?: number;
  socials: Array<{ name: 'discord' | 'x'; url: string }>;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppCardPops = Props & InheritAttrs;

const AppCard = ({
  name,
  description,
  categories,
  url,
  imgSrc,
  totalSpice,
  spicePerHour,
  socials,
  spiceMultiplier,
  userHarvest,
  refCode,
  ...props
}: AppCardPops): JSX.Element => {
  const { locale } = useLocale();

  return (
    <a href={url} rel='noreferrer' style={{ textDecoration: 'none' }} target='_blank'>
      <Card {...props} borderColor='grey-300' padding='none'>
        <StyledImgWrapper alignItems='center' justifyContent='center' padding='5xl'>
          <Avatar borderColor='grey-300' rounded='md' size='9xl' src={imgSrc} />
          <StyledSpiceChip amount={totalSpice} iconPlacement='end' onPress={console.log} />
        </StyledImgWrapper>
        <Divider />
        <Flex direction='column' padding='xl'>
          <Flex direction='column' gap='xl'>
            <Flex flex={1} gap='s' justifyContent='space-between'>
              <H3 size='lg'>{name}</H3>
              <Flex alignItems='center' flex='0' gap='md'>
                <SolidShieldCheck color='grey-50' size='s' />
                {socials.map((social) => {
                  const Social = socialsMap[social.name];

                  return (
                    <Link key={social.name} external href={social.url}>
                      <Social color='grey-50' size='s' />
                    </Link>
                  );
                })}
              </Flex>
            </Flex>
            <P color='grey-50' rows={2} size='s'>
              {description}
            </P>
            <Dl direction='column' gap='xxs'>
              <DlGroup justifyContent='space-between'>
                <Dd color='grey-50'>Spice Per Hour</Dd>
                <Dt color='grey-50'>{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerHour)}</Dt>
              </DlGroup>
              <DlGroup justifyContent='space-between'>
                <Dd color='grey-50'>Spice Multiplier</Dd>
                <Dt color='grey-50'>{spiceMultiplier}x</Dt>
              </DlGroup>
              <DlGroup justifyContent='space-between'>
                <Dd color='grey-50'>My Total Harvest</Dd>
                <Dt color='primary-400' style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Spice color='inherit' size='xs' />
                  {Intl.NumberFormat(locale, { notation: 'compact' }).format(userHarvest || 0)}
                </Dt>
              </DlGroup>
            </Dl>
          </Flex>
          <Divider marginY='xl' />
          <Flex gap='md' style={{ overflow: 'hidden' }}>
            {categories.map((category, idx) => (
              <Chip key={idx} background='grey-300'>
                {category}
              </Chip>
            ))}
          </Flex>
        </Flex>
      </Card>
    </a>
  );
};

export { AppCard };
export type { AppCardPops };
