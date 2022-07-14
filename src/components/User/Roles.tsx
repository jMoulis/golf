import styled from '@emotion/styled';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@mui/material';
import React, { useState } from 'react';
import { theme } from '../../style/theme';
import { Flexbox } from '../commons';
import { ShotButton } from '../commons/ShotButton';
import { RoleTag } from './UserStyledComponents';

const CustomShotButton = styled(ShotButton)`
  width: 150px;
  font-size: 20px;
`;

const Root = styled(Flexbox)`
  align-items: center;
`;

const roles = ['coach', 'player', 'owner'];

type Props = {
  onEdit: (roles: string[]) => void;
  selectedRoles: string[];
};

export const Roles = ({ selectedRoles, onEdit }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDeleteRole = (role: string) => {
    const updatedRoles = selectedRoles.filter((prev) => prev !== role);
    onEdit(updatedRoles);
  };
  const handleAddRole = (role: string) => {
    console.log(role);
    const existingRole = selectedRoles.find((prevRole) => prevRole === role);
    if (!existingRole) {
      onEdit([...selectedRoles, role]);
    }
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Root>
      {selectedRoles.map((role, key) => (
        <RoleTag
          key={key}
          style={{
            alignItems: 'center',
            borderRadius: '10px',
            margin: '0 5px',
            padding: '3px 10px',
            boxShadow: theme.shadows.flatButton,
          }}>
          {role}
          <ShotButton
            onClick={() => handleDeleteRole(role)}
            style={{
              height: '20px',
              width: '20px',
              backgroundColor: 'transparent',
              color: '#000',
              boxShadow: 'none',
              fontSize: '20px',
            }}>
            <FontAwesomeIcon icon={faTimes} />
          </ShotButton>
        </RoleTag>
      ))}
      <ShotButton
        style={{
          height: '35px',
          width: '35px',
          fontSize: '25px',
        }}
        type='submit'
        color='#fff'
        onClick={handleClick}
        backgroundColor={theme.colors.saveButton}>
        <FontAwesomeIcon icon={faPlus} />
      </ShotButton>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        {roles.map((role, key) => (
          <CustomShotButton key={key} onClick={() => handleAddRole(role)}>
            {role}
          </CustomShotButton>
        ))}
      </Menu>
    </Root>
  );
};
