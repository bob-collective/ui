import { Spice } from '@gobob/icons';
import {
  ArrowRight,
  Bars3,
  Button,
  Card,
  CardProps,
  Dd,
  Dl,
  Dt,
  Flex,
  SolidDocumentDuplicate,
  SolidInformationCircle,
  Span,
  Tooltip
} from '@gobob/ui';
import { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  tooltipLabel?: ReactNode;
  description?: ReactNode;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type InfoCardProps = Props & InheritAttrs;

const InfoCard = ({ description, title, tooltipLabel, children, ...props }: InfoCardProps) => {
  return (
    <Card flex={1} gap='md' justifyContent='space-between' {...props}>
      <Flex direction='column' gap='md'>
        <Flex alignItems='center' gap='s'>
          <Dt>{title}</Dt>
          {tooltipLabel && (
            <Tooltip label={tooltipLabel}>
              <SolidInformationCircle size='s' />
            </Tooltip>
          )}
        </Flex>
        <Dd size='3xl'>{description}</Dd>
      </Flex>
      {children}
    </Card>
  );
};

const UserInfo = () => {
  return (
    <Dl direction={{ base: 'column', md: 'row' }} gap='lg' marginTop='4xl'>
      <InfoCard description='$172,124.22' title='Assets Deposited'>
        <Flex gap='md' marginTop='xl'>
          <Button variant='outline'>
            <Bars3 />
          </Button>
          <Button fullWidth color='primary'>
            Bridge More
          </Button>
        </Flex>
      </InfoCard>
      <InfoCard description='3' title='Apps Used' tooltipLabel='TBD'>
        <Flex gap='md' marginTop='xl'>
          <Button variant='outline'>
            <Bars3 />
          </Button>
          <Button fullWidth variant='outline'>
            Use Apps
            <ArrowRight size='xs' strokeWidth='2' style={{ marginLeft: 4 }} />
          </Button>
        </Flex>
      </InfoCard>
      <InfoCard description='3' title='Challenges Solved' tooltipLabel='TBD'>
        <Button fullWidth variant='outline'>
          Solve Challenges
        </Button>
      </InfoCard>
      <InfoCard description='3raDX' title='Your Referral Code' tooltipLabel='TBD'>
        <Flex gap='md' marginTop='xl'>
          <Button variant='outline'>
            <Bars3 />
          </Button>
          <Button fullWidth variant='outline'>
            Copy <SolidDocumentDuplicate size='xs' style={{ marginLeft: 4 }} />
          </Button>
        </Flex>
      </InfoCard>
      <InfoCard
        description={
          <Flex direction='column' elementType='span' gap='xs'>
            <Span size='inherit'>22,201.12</Span>
            <Flex elementType='span' gap='xs'>
              <Spice size='xs' />
              <Span size='xs'>(+12,582 / Day)</Span>
            </Flex>
          </Flex>
        }
        flex={1.3}
        title='Season 3 Harvested Spice'
        tooltipLabel='TBD'
      />
    </Dl>
  );
};

export { UserInfo };
