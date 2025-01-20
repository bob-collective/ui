import { ReactNode } from 'react';
import { Trans } from '@lingui/macro';
import { Span } from '@gobob/ui';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';

import { StyledShowMore, StyledTransactionItemCard } from './ProfileActivity.style';

type TransactionItemCardProps = {
  isExpanded: boolean;
  onExpandChange: () => void;
  children: ReactNode;
};

const TransactionItemCard = ({ isExpanded, onExpandChange, children }: TransactionItemCardProps): JSX.Element => {
  const { hoverProps, isHovered } = useHover({ isDisabled: !isExpanded });

  return (
    <StyledTransactionItemCard
      disableAnimation
      $isExpanded={isExpanded}
      $isShowMoreHovered={isHovered}
      direction='column'
      isPressable={!isExpanded}
      padding='lg'
      rounded='md'
      onPress={onExpandChange}
    >
      {children}
      {isExpanded && (
        <StyledShowMore {...mergeProps({ onPress: onExpandChange }, hoverProps)}>
          <Span size='xs'>
            <Trans>Show less</Trans>
          </Span>
        </StyledShowMore>
      )}
    </StyledTransactionItemCard>
  );
};

export { TransactionItemCard };
