'use client';

import { Fragment, ReactNode } from 'react';

import {
  StyledFirstNode,
  StyledFirstNodeConnector,
  StyledGrid,
  StyledLastNode,
  StyledLastNodeConnector,
  StyledMiddleNodes,
  StyledMiddleNodesConnector
} from './StrategyBreakdown.style';

type StrategyBreakdownProps = {
  middleNodes: ReactNode[];
  firstNode: ReactNode;
  lastNode: ReactNode;
};

const StrategyBreakdown = ({ firstNode, lastNode, middleNodes }: StrategyBreakdownProps) => {
  if (middleNodes.length === 0) {
    return (
      <StyledMiddleNodes>
        {firstNode}
        <StyledMiddleNodesConnector $showArrow />
        {lastNode}
      </StyledMiddleNodes>
    );
  }

  return (
    <StyledGrid>
      <StyledFirstNode>{firstNode}</StyledFirstNode>
      <StyledFirstNodeConnector />
      <StyledMiddleNodes>
        <StyledMiddleNodesConnector $showArrow />
        {middleNodes.map((node, idx) => (
          <Fragment key={idx}>
            <div>{node}</div>
            {middleNodes.length - 1 !== idx && <StyledMiddleNodesConnector $showArrow style={{ minWidth: 20 }} />}
          </Fragment>
        ))}
        <StyledMiddleNodesConnector />
      </StyledMiddleNodes>
      <StyledLastNodeConnector />
      <StyledLastNode>{lastNode}</StyledLastNode>
    </StyledGrid>
  );
};

export { StrategyBreakdown };
