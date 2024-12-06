'use client';

import { Flex } from '@gobob/ui';

import { PageLangParam } from '@/i18n/withLigui';
import { Layout } from '@/components';

type Props = PageLangParam & {
  params: { slug: string };
};

function StakeStrategy({ params }: Props) {
  console.log(params);

  return (
    <Layout>
      <Flex direction='column' gap='xl' marginTop='xl'>
        {/* <div>My Post: {params.}</div> */}
      </Flex>
    </Layout>
  );
}

export { StakeStrategy };
