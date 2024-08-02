import styled, { css } from 'styled-components';

import { H3 } from '../Text';
import { ChevronDown } from '../../icons';

type StyledChevronDownProps = {
  $isExpanded: boolean;
};

type StyledAccordionItemButtonProps = {
  $isDisabled: boolean;
  $isFocusVisible: boolean;
};

type StyledAccordionItemRegionProps = {
  $isExpanded: boolean;
};

type StyledAccordionItemContentProps = {
  $isExpanded: boolean;
};

type StyledAccordionItemWrapperProps = {
  $isDisabled: boolean;
};

const StyledAccordion = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.accordion.base}
`;

const StyledAccordionItemWrapper = styled.div<StyledAccordionItemWrapperProps>`
  z-index: inherit;
  position: relative;
  opacity: ${({ $isDisabled }) => $isDisabled && '0.5'};
  ${({ theme }) => theme.accordion.item.base}
`;

const StyledAccordionItemHeading = styled(H3)`
  margin: 0;
  ${({ theme }) => theme.accordion.item.heading}
`;

const StyledAccordionItemButton = styled.button<StyledAccordionItemButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.25rem;
  text-overflow: ellipsis;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'default' : 'pointer')};
  appearance: none;
  background-color: inherit;
  border: 0;
  width: 100%;
  color: inherit;
  font: inherit;
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};

  ${({ theme }) => theme.accordion.item.button}
`;

const StyledChevronDown = styled(ChevronDown)<StyledChevronDownProps>`
  transform: ${({ $isExpanded }) => $isExpanded && 'rotate(-180deg)'};
  transition: transform 150ms ease;
`;

const StyledAccordionItemRegion = styled.div<StyledAccordionItemRegionProps>`
  display: grid;
  grid-template-rows: ${(props) => (props.$isExpanded ? '1fr' : '0fr')};
  transition: all 200ms ease 0ms;
`;

const StyledAccordionItemContent = styled.div<StyledAccordionItemContentProps>`
  overflow: hidden;
  padding-top: 0;
  transition: all 200ms ease 0ms;

  ${({ theme, $isExpanded }) => {
    const { paddingTop, paddingBottom, paddingLeft, paddingRight } = theme.accordion.item.content || {};

    return css`
      padding-top: ${paddingTop};
      padding-left: ${paddingLeft};
      padding-right: ${paddingRight};
      padding-bottom: ${$isExpanded ? paddingBottom : 0};
    `;
  }}
`;

export {
  StyledAccordionItemButton,
  StyledAccordionItemContent,
  StyledAccordionItemHeading,
  StyledAccordionItemRegion,
  StyledAccordionItemWrapper,
  StyledChevronDown,
  StyledAccordion
};
