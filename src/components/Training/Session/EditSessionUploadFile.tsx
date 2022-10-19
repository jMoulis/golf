import { getStorage, ref } from 'firebase/storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFileStorage } from '../../../hooks/useFileStorage';
import { useThumbnail } from '../../../hooks/useThumbnail';
import { generateFileName, generatorsKey } from '../../../utils/global.utils';
import { FileUploader } from '../../commons/FileUploader/FileUploader';
import { FileUploadType } from '../../commons/FileUploader/types';
import { AddFileType, DocumentType, UploadTaskWithID } from './types';

type Props = {
  onUpdate: (documents: DocumentType[]) => void;
  sessionId?: string;
  open: boolean;
  onClose: () => void;
};

export const EditSessionUploadFile = ({
  onUpdate,
  sessionId,
  open,
  onClose,
}: Props) => {
  const { uploadFileWithFeedback, uploadFile } = useFileStorage();
  const { generators } = useThumbnail();
  const [tasks, setTasks] = useState<UploadTaskWithID[]>([]);
  const [completedFiles, setCompletedFiles] = useState<DocumentType[]>([]);
  const [done, setDone] = useState(false);

  const addThumbnail = useCallback(
    async ({ fullPath, file, name }: AddFileType) => {
      const { extension } = generateFileName({
        file,
      });

      const key = generatorsKey(file.type);
      if (typeof generators[key] !== 'function') return null;
      const thumbnailPayload = await generators[key](file, name, extension);
      const thumbnail = thumbnailPayload?.[1];
      if (!thumbnail) return null;
      const thumbnailPath = `${fullPath}-thumbnail`;
      uploadFile(thumbnail, thumbnailPath);
    },
    [generators, uploadFile]
  );

  const addFile = useCallback(
    ({ fullPath, file, name }: AddFileType) => {
      const { extension } = generateFileName({
        file,
        fileName: name,
      });
      const storage = getStorage();
      const storageRef = ref(storage, `${fullPath}-thumbnail`);

      const document: DocumentType = {
        path: fullPath,
        name,
        mimeType: file.type,
        extension,
        thumbnail: storageRef.fullPath,
      };
      const upadtedFiles = (prev: DocumentType[]) => {
        if (prev.some((prevFile) => prevFile.path === document.path))
          return prev;
        return [...prev, document];
      };
      setCompletedFiles(upadtedFiles);
      addThumbnail({ fullPath, file, name });
    },
    [addThumbnail]
  );

  useEffect(() => {
    const tasksDoneLength = tasks.filter(
      (task) => task.loading === 'DONE'
    ).length;
    const tasksLength = tasks.length;
    const completedFilesLength = completedFiles.length;
    if (
      completedFilesLength &&
      completedFilesLength === tasksDoneLength &&
      tasksLength === tasksDoneLength
    ) {
      onUpdate(completedFiles);
      setDone(true);
    } else {
      setDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedFiles, tasks]);

  const isLoading = useMemo(() => {
    if (!tasks.length) return false;
    const tasksLength = tasks.length;
    const tasksDoneLength = tasks.filter(
      (task) => task.loading === 'DONE'
    ).length;
    if (tasksDoneLength === tasksLength) return false;
    return true;
  }, [tasks]);

  const handleUploadFile = useCallback(
    async (fileUploads: FileUploadType[]) => {
      if (sessionId) {
        fileUploads.forEach((fileUpload, index) => {
          const { file, customName } = fileUpload;
          if (file) {
            const { fileName } = generateFileName({
              file,
              fileName: customName,
            });
            const filePath = `/sessions/${sessionId}/${fileName}`;
            const task = uploadFileWithFeedback(file, filePath);
            setTasks((prev) => [
              ...prev,
              {
                id: index,
                task,
                loading: 'UNSET',
                progress: 0,
              },
            ]);
            task.on(
              'state_changed',
              (snapshot) => {
                const snapshotProgress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                switch (snapshot.state) {
                  case 'running':
                    setTasks((prev) => {
                      return prev.map((prevFile) => {
                        if (prevFile.id === index) {
                          return {
                            ...prevFile,
                            loading: 'LOADING',
                            progress: snapshotProgress,
                          };
                        }
                        return prevFile;
                      });
                    });
                    break;
                  case 'paused':
                    setTasks((prev) => {
                      return prev.map((prevFile) => {
                        if (prevFile.id === index) {
                          return {
                            ...prevFile,
                            loading: 'PAUSE',
                          };
                        }
                        return prevFile;
                      });
                    });
                    break;
                  default:
                    break;
                }
              },
              (error) => {
                switch (error.code) {
                  case 'storage/unauthorized':
                    setTasks((prev) => {
                      return prev.map((prevFile) => {
                        if (prevFile.id === index) {
                          return {
                            ...prevFile,
                            loading: 'UNAUTHORIZED',
                          };
                        }
                        return prevFile;
                      });
                    });
                    break;
                  case 'storage/canceled':
                    setTasks((prev) =>
                      prev.filter((prevFile) => prevFile.id !== index)
                    );
                    break;
                  default:
                    setTasks((prev) => {
                      return prev.map((prevFile) => {
                        if (prevFile.id === index) {
                          return {
                            ...prevFile,
                            loading: 'ERROR',
                          };
                        }
                        return prevFile;
                      });
                    });
                    break;
                }
              },
              () => {
                setTasks((prev) => {
                  return prev.map((prevFile) => {
                    if (prevFile.id === index) {
                      return {
                        ...prevFile,
                        loading: 'DONE',
                      };
                    }
                    return prevFile;
                  });
                });
                const uploadedFile = fileUploads[index];

                if (uploadedFile.file) {
                  const { fullPath, name } = task.snapshot.metadata;
                  addFile({
                    fullPath,
                    file: uploadedFile.file,
                    name,
                  });
                }
              }
            );
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionId]
  );

  const handleReset = () => {
    setTasks([]);
    setCompletedFiles([]);
    setDone(false);
  };

  return (
    <FileUploader
      onUpload={handleUploadFile}
      onResetStatus={handleReset}
      tasks={tasks}
      isLoading={isLoading}
      done={done}
      open={open}
      onClose={onClose}
    />
  );
};
