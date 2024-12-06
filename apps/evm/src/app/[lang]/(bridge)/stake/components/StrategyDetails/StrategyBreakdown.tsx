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
  // StyledSimpleGrid
} from './StrategyBreakdown.style';

type StrategyBreakdownProps = {
  middleNodes: ReactNode[];
  firstNode: ReactNode;
  lastNode: ReactNode;
};

const StrategyBreakdown = ({ firstNode, lastNode, middleNodes }: StrategyBreakdownProps) => (
  <StyledGrid>
    <StyledFirstNode>{firstNode}</StyledFirstNode>
    <StyledFirstNodeConnector />
    <StyledMiddleNodes>
      <StyledMiddleNodesConnector $showArrow />
      {middleNodes.map((node, idx) => (
        <Fragment key={idx}>
          <div>{node}</div>
          {middleNodes.length - 1 !== idx && <StyledMiddleNodesConnector $showArrow />}
        </Fragment>
      ))}
      <StyledMiddleNodesConnector />
    </StyledMiddleNodes>
    <StyledLastNodeConnector />
    <StyledLastNode>{lastNode}</StyledLastNode>
  </StyledGrid>
);

export { StrategyBreakdown };
