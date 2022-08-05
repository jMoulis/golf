import styled from '@emotion/styled';
import { faSquarePlus } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@mui/material';
import React, { useState } from 'react';
import { theme } from '../../style/theme';
import { Button } from './Buttons/Button';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Title = styled.span`
  display: block;
  font-weight: 700;
`;

type Props = {
  children: React.ReactNode;
  title: string;
  onAdd: () => void;
};

export const CollapseCard = ({ children, title, onAdd }: Props) => {
  const [open, setOpen] = useState(true);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onAdd();
  };

  return (
    <>
      <Header onClick={() => setOpen((prev) => !prev)}>
        <Title>{title}</Title>
        <Button
          onClick={handleClick}
          style={{ color: theme.colors.blue, fontSize: '25px' }}
        >
          <FontAwesomeIcon icon={faSquarePlus} />
        </Button>
      </Header>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
};
