'use client';

import { Alert, Card, Flex, Link, P } from '@gobob/ui';
import { DynamicEmbeddedWidget, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Trans } from '@lingui/macro';

import { Main } from '@/components';

type LoginProps = {
  shouldRedirect: boolean;
};

const Login = ({ shouldRedirect }: LoginProps) => {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      if (shouldRedirect) {
        router.back();
      } else {
        redirect('/');
      }
    }
  }, [isLoggedIn, router, shouldRedirect]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <Main maxWidth='md' padding='md'>
      <Alert status='info' variant='outlined'>
        <Trans>BOB Pay is currently in testing. Please try it at your own risk.</Trans>
      </Alert>
      <Flex alignItems='center' direction='column' gap='2xl' marginTop='xl' style={{ width: '100%' }}>
        <Card padding='none' style={{ width: '100%' }}>
          <DynamicEmbeddedWidget background='none' />
          <Flex justifyContent='center' paddingBottom='lg'>
            <P
              align='center'
              size='xs'
              style={{
                color: 'var(--dynamic-text-tertiary)',
                fontFamily: 'var(--dynamic-font-family-primary)',
                marginTop: '-0.5rem'
              }}
            >
              <Trans>By logging in, you agree to our</Trans>{' '}
              <Link
                external
                color='inherit'
                href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                size='inherit'
                style={{
                  fontFamily: 'inherit'
                }}
              >
                <Trans>Terms and Conditions</Trans>.
              </Link>
            </P>
          </Flex>
        </Card>
      </Flex>
    </Main>
  );
};

export { Login };
