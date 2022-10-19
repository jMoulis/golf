import styled from '@emotion/styled';
import { faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@mui/material';
import React, { useState } from 'react';
import { theme } from '../../../style/theme';
import { FloatingButton } from '../../commons/Buttons/FloatingButton';
import { ShotButton } from '../../commons/Buttons/ShotButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.backgroundPage};
  padding: 10px;
  border-radius: 10px;
  box-shadow: ${theme.shadows.listItem};
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const CustomShotButton = styled(ShotButton)`
  width: 150px;
  font-size: 20px;
`;

type Props = {
  onValidate: (holesCount: number) => void;
  onClose: () => void;
};

export const SaveMenu = ({ onValidate, onClose }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (holesCount: number) => {
    onValidate(holesCount);
    setAnchorEl(null);
    onClose();
  };

  return (
    <>
      <FloatingButton
        onClick={handleClick}
        style={{
          fontSize: '40px',
          backgroundColor: open ? theme.colors.saveButton : '#0000E5',
          color: '#fff',
        }}
      >
        <FontAwesomeIcon icon={open ? faTimes : faEllipsisV} />
      </FloatingButton>
      <Menu
        id="positioned-menu"
        aria-labelledby="positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginLeft: '-20px',
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Wrapper>
          <Title>Sauvegarder</Title>

          <CustomShotButton onClick={() => handleSubmit(9)}>
            9 holes
          </CustomShotButton>
          <CustomShotButton onClick={() => handleSubmit(18)}>
            18 holes
          </CustomShotButton>
        </Wrapper>
      </Menu>
    </>
  );
};
