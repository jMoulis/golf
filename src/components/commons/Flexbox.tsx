import styled from '@emotion/styled';

export const Flexbox = styled.div<{
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  flex?: string;
  styling?: Record<string, any>;
  flexWrap?: string;
}>`
  display: flex;
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  flex-direction: ${({ flexDirection }) => flexDirection};
  flex: ${({ flex }) => flex};
  flex-wrap: ${({ flexWrap }) => flexWrap};
  ${({ styling }) => styling};
`;
