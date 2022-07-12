import styled from '@emotion/styled';

export const PageHeader = styled.div<{
  backgroundColor?: string;
  styling?: any;
}>`
  label: PageHeader;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ backgroundColor }) => backgroundColor};
  height: 200px;
  min-height: 200px;
  font-size: 20px;
  color: #fff;
  box-shadow: 0px 7px 13px -3px rgba(190, 189, 189, 0.8);
  padding: 20px;
  ${({ styling }) => styling};
`;
