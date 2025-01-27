'use client';

import { Button, Flex, H1, P } from '@gobob/ui';
import { Discord, Twitter } from '@gobob/icons';
import { Trans } from '@lingui/macro';

import { Main } from '@/components';
import { ExternalLinks } from '@/constants';

export function Geoblock(): JSX.Element {
  return (
    <Main maxWidth='4xl'>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center' style={{ minHeight: '80vh' }}>
        <H1 align='center' size='5xl' weight='bold'>
          <Trans>We&apos;re Sorry</Trans>
        </H1>
        <P align='center'>
          <Trans>
            This website is not available in your location due to geoblocking. Geoblocking is a practice used by content
            providers to restrict access to their content based on the geographical location of the user.
          </Trans>
        </P>
        <P align='center'>
          <Trans>
            This is often done to comply with local laws and regulations. Website hosters must comply with regulations
            and may be forced to block certain countries. It seems your country is unfortunately on the list of
            restricted countries according to the Terms and Conditions of the hoster of this website. We are constantly
            working to expand our reach and provide our services to more regions.
          </Trans>
        </P>
        <P align='center'>
          <Trans>
            Thank you for your understanding and we hope to be able to serve you in a more decentralized future. The BOB
            L2 network itself is fully decentralized, cannot be censored and all code is open source.
          </Trans>
        </P>
        <Flex direction='column' gap='lg'>
          <Button asChild color='primary' variant='ghost'>
            <a href={ExternalLinks.X} rel='noreferrer' target='_blank'>
              <Flex alignItems='center' elementType='span' gap='md'>
                <Twitter color='light' /> <Trans>Follow us on X for updates</Trans>
              </Flex>
            </a>
          </Button>
          <Button asChild color='primary' variant='ghost'>
            <a href={ExternalLinks.DISCORD} rel='noreferrer' target='_blank'>
              <Flex alignItems='center' elementType='span' gap='md'>
                <Discord color='light' /> <Trans>Need support? Enter our Discord.</Trans>
              </Flex>
            </a>
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
}
