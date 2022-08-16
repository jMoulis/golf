import styled from '@emotion/styled';
import { faPause, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { theme } from '../../../style/theme';
import { UploadTaskWithID } from '../../Training/Session/types';
import { DeleteButton } from '../Buttons/DeleteButton';
import { Flexbox } from '../Flexbox';
import { FileUploadType } from './types';

const Root = styled.div<{ progress: number }>`
  margin: 5px;
  height: 20px;
  flex: 1;
  max-width: 100%;
  background-color: ${theme.colors.deleteButton};
  border-radius: 5px;
  position: relative;
  &::after {
    content: '${({ progress }) => (progress ? `${progress}%` : '')}';
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
  }
`;

const Progress = styled.div<{ progress: number }>`
  width: ${({ progress }) => `${progress}%`};
  height: 20px;
  background-color: ${theme.colors.pink};
  border-radius: 5px;
`;

type Props = {
  uploadTask: UploadTaskWithID;
  uploadFile: FileUploadType;
};

export const Progressbar = ({ uploadTask }: Props) => {
  const handleResetDownLoad = () => {
    uploadTask.task.cancel();
  };

  const handlePauseDownload = () => {
    uploadTask.task.pause();
  };

  const handleResumeDownload = () => {
    uploadTask.task.resume();
  };

  const buttonAction = useMemo(() => {
    if (uploadTask.loading === 'LOADING') return handlePauseDownload;
    if (uploadTask.loading === 'PAUSE') return handleResumeDownload;
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadTask.loading]);

  return (
    <Flexbox alignItems="center">
      <Root progress={uploadTask.progress}>
        <Progress progress={uploadTask.progress} />
      </Root>
      <Flexbox alignItems="center">
        <DeleteButton
          type="button"
          icon={uploadTask.loading === 'PAUSE' ? faPlay : faPause}
          onClick={buttonAction}
        />
        {uploadTask.loading !== 'UNSET' ? (
          <DeleteButton icon={faTimes} onClick={() => handleResetDownLoad()} />
        ) : null}
      </Flexbox>
    </Flexbox>
  );
};
