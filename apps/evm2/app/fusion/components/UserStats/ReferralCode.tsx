import {
  Button,
  DlGroup,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  QuestionMarkCircle,
  Tooltip,
  useMediaQuery
} from '@gobob/ui';
import { t } from 'i18next';
import { useTheme } from 'styled-components';

import { useGetUser } from '@/hooks';

import { StyledDt, StyledReferralCode } from './UserStats.style';

const ReferralCode = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: user } = useGetUser();

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <StyledDt size='s' weight='semibold'>
        {t('fusion.userStats.code')}
        {isMobile ? (
          <Popover>
            <PopoverTrigger>
              <Button isIconOnly size='s' variant='ghost'>
                <QuestionMarkCircle color='grey-50' size='s' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <P size='s'>{t('fusion.userStats.revealCodeInfo')}</P>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Tooltip color='primary' label={<P size='s'>{t('fusion.userStats.revealCodeInfo')}</P>}>
            <QuestionMarkCircle color='grey-50' size='s' />
          </Tooltip>
        )}
      </StyledDt>
      <StyledReferralCode $isHidden={false} size='xl' weight='bold'>
        {user?.referral_code}
      </StyledReferralCode>
    </DlGroup>
  );
};

export { ReferralCode };
