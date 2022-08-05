import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleLeft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Button = styled.button`
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonStyle?: any;
  icon?: IconProp;
};

export const NavigationButton = ({ buttonStyle, icon, onClick }: Props) => {
  return (
    <Button style={buttonStyle} onClick={onClick}>
      <FontAwesomeIcon icon={icon || faArrowCircleLeft} />
    </Button>
  );
};
