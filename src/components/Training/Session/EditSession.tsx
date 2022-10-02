import { FormEvent, useCallback, useEffect, useState } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { iOS } from 'utils/global.utils';
import { SwipeMenuHeader } from 'components/commons/SwipeMenuHeader';
import { theme } from 'style/theme';
import { FixedBottomToolbar } from 'components/commons/FixedBottomToolbar';
import { ButtonPill } from 'components/commons/Buttons/ButtonPill';
import { TaskManager } from './TaskManager';
import {
  DocumentType,
  LoadingType,
  SessionType,
  TaskType,
  VideoType,
} from './types';
import { TitleInput, DateInput } from './commonStyledComponents';
import { Flexbox } from 'components/commons';
import { FileList } from './File/FileList';
import { EditSessionUploadFile } from './EditSessionUploadFile';
import { useFileStorage } from 'hooks/useFileStorage';
import { StorageReference } from 'firebase/storage';
import { Alerts } from 'components/commons/Alerts';
import { EditSessionAddMenu } from './EditSessionAddMenu';
import { VideoRecorder } from './VideoRecorder';
import { toast } from 'react-toastify';

type Props = {
  selectedSession: SessionType;
  onClose: () => void;
  onEditDocument: (value: any, docId: string) => void;
};
export const EditSession = ({
  selectedSession,
  onClose,
  onEditDocument,
}: Props) => {
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openRecording, setOpenRecording] = useState(false);
  const [sessionForm, setSessionForm] = useState<
    | {
        topic?: string;
        date?: string;
      }
    | undefined
  >(undefined);
  const { deleteFile, uploadFileWithFeedback, updloadBase64File } =
    useFileStorage();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState<LoadingType>('UNSET');

  useEffect(() => {
    if (selectedSession) {
      setSessionForm({
        topic: selectedSession.topic,
        date: selectedSession.date?.toISOString().split('T')[0],
      });
    }
  }, [selectedSession]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSessionForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onClose();
  };

  const handleAddTask = (task: TaskType) => {
    if (!selectedSession) return null;
    const updatedSession = {
      ...selectedSession,
      tasks: [...(selectedSession.tasks || []), task],
    };
    onEditDocument(updatedSession, selectedSession.id);
  };

  const handleEditTask = (task: TaskType) => {
    if (!selectedSession) return null;
    const updatedTasks = (selectedSession?.tasks || []).map((prevTask) => {
      if (prevTask.id === task.id) {
        return task;
      }
      return prevTask;
    });
    onEditDocument(
      { ...selectedSession, tasks: updatedTasks },
      selectedSession.id
    );
  };

  const handleDeleteTask = (taskID: string) => {
    if (!selectedSession) return null;
    const updatedTasks = (selectedSession?.tasks || []).filter(
      (prevTask) => prevTask.id !== taskID
    );
    onEditDocument(
      { ...selectedSession, tasks: updatedTasks },
      selectedSession.id
    );
  };

  const handleOnBlur = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (!selectedSession) return null;
    if ((selectedSession as any)[name] === value) return null;

    onEditDocument({ ...selectedSession, [name]: value }, selectedSession.id);
  };

  const handleOnBlurDate = (event: FormEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    const valueAsDate = new Date(value);
    if (
      valueAsDate.toISOString().split('T')[0] !==
      selectedSession?.date?.toISOString().split('T')[0]
    ) {
      onEditDocument(
        { ...selectedSession, [name]: valueAsDate },
        selectedSession.id
      );
    }
  };

  const handlefiles = useCallback(
    (documents: DocumentType[]) => {
      if (selectedSession) {
        const updatedSession = {
          ...selectedSession,
          documents: [...(selectedSession.documents || []), ...documents],
        };
        onEditDocument(updatedSession, updatedSession.id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSession]
  );

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
    if (selectedSession) {
      const updatedSession = {
        ...selectedSession,
        documents: (selectedSession.documents || []).filter(
          (prevDoc) => prevDoc.path !== fileFullPath
        ),
      };
      onEditDocument(updatedSession, updatedSession.id);
    }
  };

  const handleCloseSnackbar = () => {
    setDeleteError(null);
  };

  const handleUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleRecordVideo = () => {
    setOpenRecording(true);
  };

  const handleDeleteVideo = async (video: VideoType) => {
    const filePath = `/sessions/${selectedSession.id}/${video.name}`;
    const thumbnailName = `${video.name}-thumbnail`;
    const thumbnailPath = `/sessions/${selectedSession.id}/${thumbnailName}`;
    await deleteFile(filePath);
    await deleteFile(thumbnailPath);
    const updatedDocuments = (selectedSession.documents || [])
      .filter((prevDoc) => prevDoc.name === video.name)
      .filter((prevDoc) => prevDoc.thumbnail === thumbnailName);
    const updatedSession = {
      ...selectedSession,
      documents: updatedDocuments,
    };
    onEditDocument(updatedSession, updatedSession.id);
  };

  const handleUploadVideo = (video: VideoType) => {
    if (!selectedSession) return null;
    const filePath = `/sessions/${selectedSession.id}/${video.name}`;
    const task = uploadFileWithFeedback(video.blob, filePath);
    task.on(
      'state_changed',
      (snapshot) => {
        const snapshotProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(snapshotProgress);
        setUploading('LOADING');
      },
      (error) => {
        setUploading('ERROR');
        toast.error(`Upload video: ${error.message}`);
      },
      () => {
        setUploading('DONE');
        if (selectedSession) {
          const { fullPath, name } = task.snapshot.metadata;
          const thumbnailPath = `${fullPath}-thumbnail`;
          const newDoc = {
            path: fullPath,
            name,
            mimeType: 'video/mp4',
            extension: 'mp4',
            thumbnail: thumbnailPath,
          };
          const base64 = video.thumbnail.split(';base64,')[1];

          updloadBase64File(thumbnailPath, base64, 'image/png').catch(
            (error: any) => toast.error(`UploadFile: ${error.message}`)
          );
          const updatedDocuments = [
            ...(selectedSession.documents || []),
            newDoc,
          ];
          const updatedSession = {
            ...selectedSession,
            documents: updatedDocuments,
          };
          onEditDocument(updatedSession, updatedSession.id);
        }
      }
    );
  };

  return (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        anchor="bottom"
        open={Boolean(selectedSession)}
        onClose={onClose}
        onOpen={() => {}}
      >
        <SwipeMenuHeader title="Modifier une session" />
        <Flexbox
          flexDirection="column"
          style={{ backgroundColor: '#fff', padding: '5px' }}
        >
          <Flexbox flexDirection="column" flex="1">
            <Flexbox flexDirection="column">
              <span>Sujet</span>
              <TitleInput
                name="topic"
                onChange={handleChange}
                value={sessionForm?.topic || ''}
                onBlur={handleOnBlur}
              />
            </Flexbox>
            <Flexbox flexDirection="column">
              <span>Date</span>
              <DateInput
                type="date"
                name="date"
                onChange={handleChange}
                value={sessionForm?.date || ''}
                onBlur={handleOnBlurDate}
              />
            </Flexbox>
          </Flexbox>
          <FileList
            files={selectedSession?.documents || []}
            sessionID={selectedSession?.id}
            onDelete={handleDeleteFile}
          />
        </Flexbox>
        <EditSessionUploadFile
          sessionId={selectedSession?.id}
          onUpdate={handlefiles}
          open={openUploadFile}
          onClose={() => setOpenUploadFile(false)}
        />
        <TaskManager
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          tasks={selectedSession?.tasks || []}
          onDeleteTask={handleDeleteTask}
        />
        <EditSessionAddMenu
          onAddTask={handleAddTask}
          onUploadFile={handleUploadFile}
          onRecordVideo={handleRecordVideo}
        />
        <FixedBottomToolbar>
          <ButtonPill onClick={handleSubmit}>FERMER</ButtonPill>
        </FixedBottomToolbar>
      </SwipeableDrawer>
      <VideoRecorder
        open={openRecording}
        onClose={() => setOpenRecording(false)}
        onOpen={() => setOpenRecording(true)}
        onUpload={handleUploadVideo}
        onDelete={handleDeleteVideo}
        uploadProgress={uploadProgress}
        uploading={uploading}
      />
      <Alerts
        open={Boolean(deleteError)}
        onClose={handleCloseSnackbar}
        severity="error"
        message={deleteError || 'Error'}
      />
    </>
  );
};
