import { FormEvent, useEffect, useState } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { iOS } from '../../../utils/global.utils';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { theme } from '../../../style/theme';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ButtonPill } from '../../commons/ButtonPill';
import { TaskManager } from './TaskManager';
import { SessionType, TaskType } from './types';
import { useSession } from './useSession';
import { ENUM_COLLECTION } from '../../../hooks/enumCollection';
import { TitleInput } from './commonStyledComponents';

type Props = {
  selectedSession: SessionType;
  onClose: () => void;
};
export const EditSession = ({ selectedSession, onClose }: Props) => {
  const [form, setForm] = useState<SessionType | null>(null);
  const { onEditDocument } = useSession(ENUM_COLLECTION.SESSION);

  useEffect(() => {
    if (selectedSession) {
      setForm(selectedSession);
    } else {
      setForm(null);
    }
  }, [selectedSession]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prevForm: any) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    onClose();
  };
  const handleAddTask = (task: TaskType) => {
    if (!form) return null;
    const updatedSession = {
      ...form,
      tasks: [...(form.tasks || []), task],
    };
    setForm(updatedSession);
    onEditDocument(updatedSession, form.id);
  };

  const handleEditTask = (task: TaskType) => {
    if (!form) return null;

    const updatedTasks = form?.tasks.map((prevTask) => {
      if (prevTask.id === task.id) {
        return task;
      }
      return prevTask;
    });
    onEditDocument({ ...form, tasks: updatedTasks }, form.id);
    setForm({ ...form, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskID: string) => {
    if (!form) return null;
    const updatedTasks = form?.tasks.filter(
      (prevTask) => prevTask.id !== taskID
    );
    onEditDocument({ ...form, tasks: updatedTasks }, form.id);
    setForm({ ...form, tasks: updatedTasks });
  };

  const handleOnBlur = () => {
    if (!form) return null;
    onEditDocument(form, form.id);
  };

  if (!form) return null;

  return (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        anchor="bottom"
        open={Boolean(form)}
        onClose={onClose}
        onOpen={() => {}}
      >
        <SwipeMenuHeader title="Modifier une session" />
        <TitleInput
          name="topic"
          onChange={handleChange}
          value={form.topic}
          onBlur={handleOnBlur}
        />
        <TaskManager
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          tasks={form.tasks || []}
          onDeleteTask={handleDeleteTask}
        />
        <FixedBottomToolbar>
          <ButtonPill onClick={handleSubmit}>FERMER</ButtonPill>
        </FixedBottomToolbar>
      </SwipeableDrawer>
    </>
  );
};
