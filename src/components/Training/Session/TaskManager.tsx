import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FloatingButton } from '../../commons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { BOTTOM_NAVBAR_HEIGHT, FLOATING_HEIGHT } from '../../cssConstants';
import { AddTask } from './AddTask';
import { EditTask } from './EditTask';
import { TaskType } from './types';

const CustomList = styled(List)`
  max-height: calc(
    100vh - ${BOTTOM_NAVBAR_HEIGHT} - ${FLOATING_HEIGHT} - ${FLOATING_HEIGHT}
  );
`;

const CustomListItem = styled(ListItem)`
  margin: 5px;
`;

type Props = {
  tasks: TaskType[];
  onAddTask: (task: TaskType) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskID: string) => void;
};

export const TaskManager = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddTask
        onAddTask={onAddTask}
        open={open}
        onClose={() => setOpen(false)}
      />
      <CustomList>
        {tasks.map((task, key) => (
          <CustomListItem key={key}>
            <EditTask
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </CustomListItem>
        ))}
      </CustomList>
      <FloatingButton
        onClick={() => setOpen(true)}
        backgroundColor="#000"
        color="#fff"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
    </>
  );
};
