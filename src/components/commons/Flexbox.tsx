import styled from '@emotion/styled';

export const Flexbox = styled.div<{
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  flex?: string;
  styling?: Record<string, any>;
}>`
  display: flex;
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  flex-direction: ${({ flexDirection }) => flexDirection};
  flex: ${({ flex }) => flex};
  ${({ styling }) => styling};
`;
