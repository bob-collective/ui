import { Button, Flex, H1, P } from '@gobob/ui';
import { Discord, Twitter } from '@gobob/icons';

import { Main } from '@/components';

export default function Geoblock(): JSX.Element {
  return (
    <Main maxWidth='4xl'>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center' style={{ minHeight: '80vh' }}>
        <H1 align='center' fontFamily='Syne' size='5xl' weight='bold'>
          We&apos;re Sorry
        </H1>
        <P align='center'>
          This website is not available in your location due to geoblocking. Geoblocking is a practice used by content
          providers to restrict access to their content based on the geographical location of the user.
        </P>
        <P align='center'>
          This is often done to comply with local laws and regulations. Website hosters must comply with regulations and
          may be forced to block certain countries. It seems your country is unfortunately on the list of restricted
          countries according to the Terms and Conditions of the hoster of this website. We are constantly working to
          expand our reach and provide our services to more regions.
        </P>
        <P align='center'>
          Thank you for your understanding and we hope to be able to serve you in a more decentralized future. The BOB
          L2 network itself is fully decentralized, cannot be censored and all code is open source.
        </P>
        <Flex direction='column' gap='lg'>
          <Button asChild color='primary' variant='ghost'>
            <a href='https://twitter.com/build_on_bob' rel='noreferrer' target='_blank'>
              <Flex alignItems='center' elementType='span' gap='md'>
                <Twitter color='light' /> Follow us on X for updates
              </Flex>
            </a>
          </Button>
          <Button asChild color='primary' variant='ghost'>
            <a href='https://discord.gg/gobob' rel='noreferrer' target='_blank'>
              <Flex alignItems='center' elementType='span' gap='md'>
                <Discord color='light' /> Need support? Enter our Discord.
              </Flex>
            </a>
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
}
