import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FloatingButton } from '../../commons/Buttons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { BOTTOM_NAVBAR_HEIGHT, FLOATING_HEIGHT } from '../../cssConstants';
import { EditTask } from './EditTask';
import { TaskType } from './types';
import { v4 } from 'uuid';

const CustomList = styled(List)`
  max-height: calc(
    100vh - ${BOTTOM_NAVBAR_HEIGHT} - ${FLOATING_HEIGHT} - ${FLOATING_HEIGHT} -
      120px
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
  const handleAddTask = () => {
    const taskId = v4();
    onAddTask({ id: taskId, text: '', status: false });
  };
  return (
    <>
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
        onClick={handleAddTask}
        backgroundColor="#000"
        color="#fff"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
    </>
  );
};
