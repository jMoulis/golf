import styled from '@emotion/styled';
import { faXmarkSquare } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { theme } from '../../style/theme';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
  background-color: ${theme.colors.blueGreen};
  align-items: center;
  color: ${theme.colors.blue};
  & span {
    font-weight: 700;
  }
`;
const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 30px;
  color: ${theme.colors.blue};
`;

type Props = {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export const SwipeMenuHeader = ({ title, onClose, children }: Props) => {
  return (
    <Header>
      <span>{title}</span>
      {children}
      <CloseButton onClick={onClose}>
        <FontAwesomeIcon icon={faXmarkSquare} />
      </CloseButton>
    </Header>
  );
};
