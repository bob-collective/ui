import { Spice } from '@gobob/icons';
import { ArrowRight, Bars3, Button, Divider, Flex, H3, P, SolidDocumentDuplicate, Span } from '@gobob/ui';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { LoginSection } from '../../../../components';
import { RoutesPath } from '../../../../constants';
import { UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';

import { StyledDl, StyledLoginCard } from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserAssetsModal } from './UserAssetsModal';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  isAuthenticated?: boolean;
};

const UserInfo = ({ user, isAuthenticated }: UserInfoProps) => {
  const [isUserAssetsModalOpen, setUserAssetsModalOpen] = useState(false);

  if (!(isAuthenticated || user)) {
    return (
      <Flex justifyContent='center' style={{ marginTop: '4.594rem', marginBottom: '4.594rem' }}>
        <StyledLoginCard gap='lg'>
          <H3 align='center' size='md'>
            Log in to View Dashboard
          </H3>
          <Divider />
          <P align='center' color='grey-50' size='s'>
            Set sail on your Season 3 adventure, charting new territories and harvesting Spice along the way.
          </P>
          <Button asChild color='primary' size='xl'>
            <Link to={RoutesPath.SIGN_UP}>Start Harvesting Spice</Link>
          </Button>
          <LoginSection direction={{ base: 'column', s: 'row' }} />
        </StyledLoginCard>
      </Flex>
    );
  }

  const appsUsedCount = user?.season3Data.harvestedPointsS3.length;

  return (
    <div style={{ position: 'relative' }}>
      <StyledDl direction={{ base: 'column', md: 'row' }} gap='lg' marginTop='4xl' style={{ zIndex: 0 }}>
        <UserInfoCard description='$172,124.22' title='Assets Deposited'>
          <Flex gap='md' marginTop='xl'>
            <Button variant='outline' onPress={() => setUserAssetsModalOpen(true)}>
              <Bars3 />
            </Button>
            <Button fullWidth color='primary'>
              Bridge More
            </Button>
          </Flex>
          <UserAssetsModal isOpen={isUserAssetsModalOpen} onClose={() => setUserAssetsModalOpen(false)} />
        </UserInfoCard>
        <UserInfoCard description={appsUsedCount} title='Apps Used' tooltipLabel='TBD'>
          <Flex gap='md' marginTop='xl'>
            <Button variant='outline'>
              <Bars3 />
            </Button>
            <Button fullWidth variant='outline'>
              Use Apps
              <ArrowRight size='xs' strokeWidth='2' style={{ marginLeft: 4 }} />
            </Button>
          </Flex>
        </UserInfoCard>
        <UserInfoCard description='3' title='Challenges Solved' tooltipLabel='TBD'>
          <Button fullWidth variant='outline'>
            Solve Challenges
          </Button>
        </UserInfoCard>
        <UserInfoCard description='3raDX' title='Your Referral Code' tooltipLabel='TBD'>
          <Flex gap='md' marginTop='xl'>
            <Button variant='outline'>
              <Bars3 />
            </Button>
            <Button fullWidth variant='outline'>
              Copy <SolidDocumentDuplicate size='xs' style={{ marginLeft: 4 }} />
            </Button>
          </Flex>
        </UserInfoCard>
        <UserInfoCard
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
      </StyledDl>
      {/* <div
        style={{
          opacity: 0.8,
          top: '-0.75rem',
          bottom: '-0.75rem',
          left: '-0.75rem',
          right: '-0.75rem',
          position: 'absolute',
          zIndex: 1,
          backdropFilter: 'blur(3px)'
        }}
      />
      <Flex
        justifyContent='center'
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2 }}
      >
        <StyledLoginCard shadowed borderColor='grey-300' gap='lg'>
          <H3 align='center' size='md'>
            Log in to View Dashboard
          </H3>
          <Divider />
          <P align='center' color='grey-50' size='s'>
            Set sail on your Season 3 adventure, charting new territories and harvesting Spice along the way.
          </P>
          <Button asChild color='primary' size='xl'>
            <Link to={RoutesPath.SIGN_UP}>Start Harvesting Spice</Link>
          </Button>
          <LoginSection direction={{ base: 'column', s: 'row' }} />
        </StyledLoginCard>
      </Flex> */}
    </div>
  );
};

export { UserInfo };
