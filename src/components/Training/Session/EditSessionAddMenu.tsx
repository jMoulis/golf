import { Menu } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 } from 'uuid';
import { theme } from '../../../style/theme';
import { FloatingButton } from '../../commons/Buttons/FloatingButton';
import { ShotButton } from '../../commons/Buttons/ShotButton';
import { TaskType } from './types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.backgroundPage};
  padding: 10px;
  border-radius: 10px;
  box-shadow: ${theme.shadows.listItem};
`;

const CustomShotButton = styled(ShotButton)`
  width: 150px;
  font-size: 20px;
`;

type Props = {
  onAddTask: (task: TaskType) => void;
  onUploadFile: () => void;
  onRecordVideo: () => void;
};

export const EditSessionAddMenu = ({
  onAddTask,
  onUploadFile,
  onRecordVideo,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddTask = () => {
    setAnchorEl(null);
    const taskId = v4();
    onAddTask({ id: taskId, text: '', status: false });
  };
  const handleUploadFile = () => {
    setAnchorEl(null);
    onUploadFile();
  };
  const handleRecord = () => {
    setAnchorEl(null);
    onRecordVideo();
  };

  return (
    <>
      <FloatingButton onClick={handleClick} backgroundColor="#000" color="#fff">
        <FontAwesomeIcon icon={open ? faTimes : faPlus} size="3x" />
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
          <CustomShotButton onClick={handleAddTask}>
            Créer une tâche
          </CustomShotButton>
          <CustomShotButton onClick={handleUploadFile}>
            Importer un fichier
          </CustomShotButton>
          <CustomShotButton onClick={handleRecord}>
            Enregisrer une video
          </CustomShotButton>
        </Wrapper>
      </Menu>
    </>
  );
};
