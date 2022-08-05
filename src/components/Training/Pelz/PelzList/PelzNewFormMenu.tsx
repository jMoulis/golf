import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@mui/material';
import React, { useState } from 'react';
import { FloatingButton } from '../../../commons/Buttons/FloatingButton';
import { ShotButton } from '../../../commons/Buttons/ShotButton';
import { ENUM_PELZ_THEME } from '../enums';

const CustomShotButton = styled(ShotButton)`
  width: 150px;
  font-size: 20px;
`;

type Props = {
  onCreate: (theme: ENUM_PELZ_THEME) => void;
};

export const PelzNewFormMenu = ({ onCreate }: Props) => {
  const [anchorEl, setAnchotEl] = useState<any | null>(null);

  const handleCreate = (theme: ENUM_PELZ_THEME) => {
    onCreate(theme);
    setAnchotEl(null);
  };
  const handleClose = () => {
    setAnchotEl(null);
  };
  return (
    <>
      <FloatingButton
        onClick={(event) => setAnchotEl(event.currentTarget)}
        backgroundColor="#000"
        color="#fff"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
      <Menu
        id="positioned-menu"
        aria-labelledby="positioned-button"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <CustomShotButton
          onClick={() => handleCreate(ENUM_PELZ_THEME.SHORT_GAME)}
        >
          {ENUM_PELZ_THEME.SHORT_GAME}
        </CustomShotButton>
        <CustomShotButton onClick={() => handleCreate(ENUM_PELZ_THEME.PUTTING)}>
          {ENUM_PELZ_THEME.PUTTING}
        </CustomShotButton>
      </Menu>
    </>
  );
};
