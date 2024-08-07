import { Button, Flex, H1, P, Main } from '@gobob/ui';
import { Link } from 'react-router-dom';

import { RoutesPath } from '../../constants';

const Custom404 = (): JSX.Element => {
  return (
    <Main>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center' style={{ minHeight: '80vh' }}>
        <H1 align='center' fontFamily='Syne' size='5xl' weight='bold'>
          404 Error
        </H1>
        <P align='center'>
          Sorry, the page you are looking for doesn&apos;t exist or has been moved. Here are some helpful links:
        </P>
        <Flex gap='xl'>
          <Button asChild color='primary' variant='outline'>
            <Link to={-1 as any}>Go Back</Link>
          </Button>
          <Button asChild color='primary'>
            <Link to={RoutesPath.HOME}>Take em home</Link>
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
};

export { Custom404 };
