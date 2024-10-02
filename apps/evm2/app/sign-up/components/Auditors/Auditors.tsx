import { Dl, DlGroup, Dt, Dd, Flex } from '@gobob/ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import trailsOfBitsSrc from '@/assets/trails-of-bits.png';
import commonPrefixSrc from '@/assets/common-prefix.png';
import otterSecSrc from '@/assets/otter-sec.png';

const Auditors = () => {
  const { t } = useTranslation();

  return (
    <Dl gap='md' justifyContent='center'>
      <DlGroup direction={{ base: 'column', s: 'row' }} gap='xl' justifyContent='center'>
        <Dt noWrap color='grey-50' size='s'>
          {t('fusion.deposit.auditedBy')}
        </Dt>
        <Dd style={{ width: '100%' }}>
          <Flex wrap alignItems='center' elementType='span' gap='2xl' justifyContent='space-around'>
            <a
              aria-label='navigate to Trails of Bits audit'
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Trail_of_Bits.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image alt='Trails of Bits auditor' height='24' src={trailsOfBitsSrc} width='40' />
            </a>
            <a
              aria-label='navigate to Common Prefix audit'
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Common_Prefix.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image alt='Common Prefix auditor' height='10' src={commonPrefixSrc} width='105' />
            </a>
            <a
              aria-label='navigate to OtterSec audit'
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Ottersec.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image alt='OtterSec auditor' height='16' src={otterSecSrc} width='76' />
            </a>
          </Flex>
        </Dd>
      </DlGroup>
    </Dl>
  );
};

export { Auditors };
