import styled, { css } from 'styled-components';

const StyledGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: auto 1.5rem auto; /* Adjust heights for alignment */
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; /* Support up to 5 bottom nodes */
  grid-template-areas:
    'first-node first-node first-node first-node last-node last-node last-node last-node'
    'first-connector . . . . . . last-connector'
    'first-connector middle-nodes middle-nodes middle-nodes middle-nodes middle-nodes middle-nodes last-connector';
`;

const StyledFirstNode = styled.div`
  grid-area: first-node;

  display: flex;
`;

const StyledFirstNodeConnector = styled.div`
  grid-area: first-connector;

  position: relative;

  &::before {
    content: '';
    position: absolute;

    top: 0;
    left: 50%;
    width: 50%;
    height: calc(50% + 0.75rem);

    border-left: 1px solid ${({ theme }) => theme.color('grey-200')};
    border-bottom: 1px solid ${({ theme }) => theme.color('grey-200')};
  }
`;

const StyledLastNode = styled.div`
  grid-area: last-node;

  display: flex;
  justify-content: flex-end;
`;

const StyledLastNodeConnector = styled.div`
  grid-area: last-connector;

  position: relative;

  &::after {
    content: '';
    position: absolute;

    border: solid ${({ theme }) => theme.color('grey-200')};
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent ${({ theme }) => theme.color('grey-200')} transparent;
    transform: translateX(50%);
    top: 0;
    right: 50%;
  }

  &::before {
    content: '';
    position: absolute;

    top: 0;
    right: 50%;
    width: 50%;
    height: calc(50% + 0.75rem);

    border-right: 1px solid ${({ theme }) => theme.color('grey-200')};
    border-bottom: 1px solid ${({ theme }) => theme.color('grey-200')};
  }
`;

const StyledMiddleNodes = styled.div`
  grid-area: middle-nodes;

  display: flex;
  width: 100%;
`;

type StyledMiddleNodesConnectorProps = {
  $showArrow?: boolean;
};

const StyledMiddleNodesConnector = styled.div<StyledMiddleNodesConnectorProps>`
  position: relative;

  flex: 1 1 0%;
  /* min-width: 15px; */

  ${({ $showArrow }) =>
    $showArrow &&
    css`
      &::after {
        content: '';
        position: absolute;

        border: solid ${({ theme }) => theme.color('grey-200')};
        border-width: 5px 0 5px 5px;
        border-color: transparent transparent transparent ${({ theme }) => theme.color('grey-200')};
        transform: translateY(-50%);
        top: calc(50%);
        right: 0;
      }
    `}

  &::before {
    content: '';
    position: absolute;

    top: 0;
    width: 100%;
    height: 50%;

    border-bottom: 1px solid ${({ theme }) => theme.color('grey-200')};
  }
`;

export {
  StyledGrid,
  StyledFirstNode,
  StyledMiddleNodes,
  StyledFirstNodeConnector,
  StyledLastNodeConnector,
  StyledLastNode,
  StyledMiddleNodesConnector
};
