import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../../style/theme';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
  align-items: center;
  color: ${theme.colors.blue};
  border-bottom: 1px solid ${theme.colors.separator};
  & span {
    font-weight: 700;
    text-transform: uppercase;
  }
`;
const HandleBar = styled.span`
  background-color: ${theme.colors.handleBar};
  height: 3px;
  width: 30px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const SwipeMenuHeader = ({ title, children }: Props) => {
  return (
    <Header>
      <HandleBar />
      <span>{title}</span>
      {children}
    </Header>
  );
};
