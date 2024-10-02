'use client';

import React from 'react';
import { Button, Flex, H1, P } from '@gobob/ui';
import { Link } from '@gobob/ui';
import { useRouter } from 'next/navigation';

import { Main } from '@/components';
import { RoutesPath } from '@/constants';

export default function NotFound(): JSX.Element {
  const router = useRouter();

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
            <Link onClick={router.back}>Go Back</Link>
          </Button>
          <Button asChild color='primary'>
            <Link href={RoutesPath.HOME}>Take em home</Link>
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
}
