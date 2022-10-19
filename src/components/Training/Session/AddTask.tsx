import React, { FormEvent, useState } from 'react';
import { v4 } from 'uuid';
import { SwipeableDrawer, TextareaAutosize } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/pro-duotone-svg-icons';
import { Button, Flexbox } from '../../commons';
import { TaskType } from './types';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { iOS } from '../../../utils/global.utils';
import { theme } from '../../../style/theme';

type Props = {
  onAddTask: (task: TaskType) => void;
  open: boolean;
  onClose: () => void;
};

export const AddTask = ({ onAddTask, open, onClose }: Props) => {
  const [task, setTask] = useState<TaskType | null>(null);

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setTask((prevTask: any) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleEditSession = () => {
    if (task) {
      const taskId = v4();
      onAddTask({ ...task, id: taskId });
      setTask(null);
      onClose();
    }
  };

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
    >
      <SwipeMenuHeader title="Ajouter une tâche" />
      <Flexbox style={{ backgroundColor: '#fff' }}>
        <TextareaAutosize
          style={{
            border: 'none',
            fontSize: '20px',
            flex: 1,
            resize: 'none',
          }}
          name="text"
          onChange={handleChange}
          value={task?.text || ''}
          placeholder="Saisir un commentaire..."
        />
        <Button onClick={handleEditSession}>
          <FontAwesomeIcon icon={faPlusSquare} size="2x" />
        </Button>
      </Flexbox>
    </SwipeableDrawer>
  );
};
