'use client';

import React from 'react';
import { Button, Flex, H1, P } from '@gobob/ui';
import { Link } from '@gobob/ui';
import { useParams, useRouter } from 'next/navigation';
import { Trans } from '@lingui/macro';

import { Main } from '@/components';
import { RoutesPath } from '@/constants';

export function NotFound(): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <Main>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='center' style={{ minHeight: '80vh' }}>
        <H1 align='center' size='5xl' weight='bold'>
          <Trans>404 Error</Trans>
        </H1>
        <P align='center'>
          <Trans>
            Sorry, the page you are looking for doesn&apos;t exist or has been moved. Here are some helpful links:
          </Trans>
        </P>
        <Flex gap='xl'>
          <Button asChild color='primary' variant='outline'>
            <Link onClick={router.back}>
              <Trans>Go Back</Trans>
            </Link>
          </Button>
          <Button asChild color='primary'>
            <Link href={`/${params.lang}${RoutesPath.HOME}`}>
              <Trans>Take em home</Trans>
            </Link>
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
}
