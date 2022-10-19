import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 15px;
  margin: 0.25rem;
  color: #fff;
  border-radius: 200px;
  height: 20px;
  width: 20px;
  background-color: transparent;
  & span {
    display: inline-block;
    margin-left: 5px;
    font-size: 15px;
  }
`;

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: IconProp;
  buttonStyle?: any;
  type?: 'button' | 'submit' | 'reset';
};
export const CloseButton = ({ onClick, icon, buttonStyle, type }: Props) => {
  return (
    <Button type={type || 'button'} style={buttonStyle} onClick={onClick}>
      <FontAwesomeIcon icon={icon || faTimes} />
    </Button>
  );
};
