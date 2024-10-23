import { Dl, DlGroup, Dt, Dd, Flex } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import Image from 'next/image';
import { useLingui } from '@lingui/react';

import trailsOfBits from '@public/assets/trails-of-bits.png';
import commonPrefix from '@public/assets/common-prefix.png';
import otterSec from '@public/assets/otter-sec.png';

const Auditors = () => {
  const { i18n } = useLingui();

  return (
    <Dl gap='md' justifyContent='center'>
      <DlGroup direction={{ base: 'column', s: 'row' }} gap='xl' justifyContent='center'>
        <Dt noWrap color='grey-50' size='s'>
          <Trans>Audited by</Trans>
        </Dt>
        <Dd style={{ width: '100%' }}>
          <Flex wrap alignItems='center' elementType='span' gap='2xl' justifyContent='space-around'>
            <a
              aria-label={t(i18n)`navigate to Trails of Bits audit`}
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Trail_of_Bits.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image
                alt={t(i18n)`Trails of Bits auditor`}
                height='24'
                src={trailsOfBits}
                width='40'
                placeholder='blur'
              />
            </a>
            <a
              aria-label={t(i18n)`navigate to Common Prefix audit`}
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Common_Prefix.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image
                alt={t(i18n)`Common Prefix auditor`}
                height='10'
                src={commonPrefix}
                width='105'
                placeholder='blur'
              />
            </a>
            <a
              aria-label={t(i18n)`navigate to OtterSec audit`}
              href='https://github.com/bob-collective/fusion-lock/blob/main/audits/Ottersec.pdf'
              rel='noreferrer'
              target='_blank'
            >
              <Image alt={t(i18n)`OtterSec auditor`} height='16' src={otterSec} width='76' placeholder='blur' />
            </a>
          </Flex>
        </Dd>
      </DlGroup>
    </Dl>
  );
};

export { Auditors };
