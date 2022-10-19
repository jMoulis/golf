import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { theme } from '../../../style/theme';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 20px;
  margin: 0.25rem;
  color: #fff;
  border-radius: 200px;
  height: 40px;
  width: 40px;
  min-height: 40px;
  min-width: 40px;
  background-color: ${theme.colors.deleteButton};
  box-shadow: ${theme.shadows.button};
  & span {
    display: inline-block;
    margin-left: 5px;
    font-size: 15px;
  }
  &:disabled {
    background-color: ${theme.colors.deleteButton};
    color: rgba(255, 255, 255, 0.5);
  }
`;

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: IconProp;
  buttonStyle?: any;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};
export const DeleteButton = ({
  onClick,
  icon,
  buttonStyle,
  type,
  disabled,
}: Props) => {
  return (
    <Button
      disabled={disabled}
      type={type || 'button'}
      style={buttonStyle}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon || faTrash} />
    </Button>
  );
};
