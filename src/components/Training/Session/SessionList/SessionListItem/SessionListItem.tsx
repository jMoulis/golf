import styled from '@emotion/styled';
import { useMemo, useRef, useState } from 'react';
import { Flexbox } from '../../../../commons';
import { DateDisplay } from '../../../../commons/DateDisplay';
import { DeleteButton } from '../../../../commons/Buttons/DeleteButton';
import { ListItem } from '../../../../commons/List';
import { SessionType, TaskType } from '../../types';
import { TaskCheckStatus } from './TaskCheckStatus';
import { FileList } from '../../File/FileList';
import { StorageReference } from 'firebase/storage';
import { useFileStorage } from '../../../../../hooks/useFileStorage';
import { Alerts } from '../../../../commons/Alerts';

const CustomListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`;

const Topic = styled.span`
  font-weight: bold;
`;

type Props = {
  session: SessionType;
  onSelectSession: (session: SessionType) => void;
  onDeleteSession: (sessionID: string) => void;
  onEditDocument: (value: any, docId: string) => void;
};

export const SessionListItem = ({
  session,
  onSelectSession,
  onDeleteSession,
  onEditDocument,
}: Props) => {
  const { deleteFile } = useFileStorage();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteFile = async (
    fileRef: StorageReference,
    thumbnailRef: StorageReference
  ) => {
    if (!fileRef || !thumbnailRef) return null;
    const fileDeletePayload = await deleteFile(fileRef.fullPath);
    if (fileDeletePayload?.ERROR) {
      setDeleteError(fileDeletePayload.ERROR);
    }
    const thumbnailDeletePayload = await deleteFile(thumbnailRef.fullPath);

    if (thumbnailDeletePayload?.ERROR) {
      setDeleteError(thumbnailDeletePayload.ERROR);
    }
    const fileFullPath = fileRef.fullPath;
    if (session) {
      const updatedSession = {
        ...session,
        documents: (session.documents || []).filter(
          (prevDoc) => prevDoc.path !== fileFullPath
        ),
      };
      onEditDocument(updatedSession, updatedSession.id);
    }
  };

  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());

  const taskTypes = useMemo(
    () => (tasks: TaskType[]) => {
      return {
        done: tasks.filter((task) => task.status)?.length,
        unDone: tasks.filter((task) => !task.status)?.length,
      };
    },
    []
  );

  const handleCloseSnackbar = () => {
    setDeleteError(null);
  };

  return (
    <CustomListItem>
      <Flexbox flex="1" justifyContent="space-between" alignItems="center">
        <Flexbox flexDirection="column">
          <Topic onClick={() => onSelectSession(session)}>
            {session.topic || 'Aucun sujet'}
          </Topic>
          <DateDisplay>{dateFormat.current.format(session.date)}</DateDisplay>
          <FileList
            files={session?.documents || []}
            sessionID={session?.id}
            onDelete={handleDeleteFile}
          />
        </Flexbox>
        <Flexbox>
          <TaskCheckStatus status count={taskTypes(session.tasks || []).done} />
          <TaskCheckStatus
            status={false}
            count={taskTypes(session.tasks || []).unDone}
          />
        </Flexbox>
      </Flexbox>
      <DeleteButton onClick={() => onDeleteSession(session.id)} />
      <Alerts
        open={Boolean(deleteError)}
        onClose={handleCloseSnackbar}
        severity="error"
        message={deleteError || 'Error'}
      />
    </CustomListItem>
  );
};
