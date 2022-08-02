import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextareaAutosize } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { Flexbox } from '../../commons';
import { DeleteButton } from '../../commons/DeleteButton';
import { Checkbox } from './commonStyledComponents';
import { TaskType } from './types';

type Props = {
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskID: string) => void;
  task: TaskType;
};

export const EditTask = ({ onEditTask, task, onDeleteTask }: Props) => {
  const [form, setForm] = useState<TaskType | null>(null);

  useEffect(() => {
    setForm(task);
  }, [task]);

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prevTask: any) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleEditTask = (event: FormEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    if (form) {
      const updatedTask = {
        ...form,
        status: checked,
      };
      onEditTask(updatedTask);
      setForm(updatedTask);
    }
  };

  const handleEditSession = (event: FormEvent<HTMLTextAreaElement>) => {
    if (form) {
      const { name, value } = event.currentTarget;
      if ((task as any)[name] === value) return null;
      onEditTask(form);
    }
  };

  const handleDeleteTask = () => {
    if (!form) return null;
    onDeleteTask(form.id);
  };

  return (
    <Flexbox alignItems="center">
      <Checkbox
        type="checkbox"
        name="status"
        checked={form?.status || false}
        onChange={handleEditTask}
      />
      <TextareaAutosize
        style={{
          border: 'none',
          fontSize: '20px',
          flex: 1,
          resize: 'none',
        }}
        name="text"
        onChange={handleChange}
        value={form?.text || ''}
        onBlur={handleEditSession}
      />
      <DeleteButton onClick={handleDeleteTask}>
        <FontAwesomeIcon icon={faTrash} />
      </DeleteButton>
    </Flexbox>
  );
};
