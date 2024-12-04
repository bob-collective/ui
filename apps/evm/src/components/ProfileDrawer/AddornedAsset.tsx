'use client';

import { Flex } from '@gobob/ui';
import { ReactNode } from 'react';

const AddornedAsset = ({ addornment, asset }: { asset: ReactNode; addornment: ReactNode }) => {
  return (
    <Flex
      elementType='span'
      style={{ position: 'relative', display: 'inline-flex', width: 'max-content', height: 'fit-content' }}
    >
      {asset}
      <span
        style={{
          display: 'inline-flex',
          position: 'absolute',
          bottom: 0,
          right: 0,
          border: '1px solid #000000',
          borderRadius: 99999,
          overflow: 'hidden',
          transform: 'translate(15%,15%)'
        }}
      >
        {addornment}
      </span>
    </Flex>
  );
};

export { AddornedAsset };
