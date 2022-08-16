/* eslint-disable no-constant-condition */
import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import { useCallback, useState } from 'react';
import { theme } from '../../../style/theme';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';
import { UploadTaskWithID } from '../../Training/Session/types';
import { ButtonPill } from '../Buttons/ButtonPill';
import { FixedBottomToolbar } from '../FixedBottomToolbar';
import { SwipeMenuHeader } from '../SwipeMenuHeader';
import { DialogConfirmation } from './DialogConfirmation';
import { PreviewFiles } from './PreviewFiles';
import { InputFile } from './InputFile';
import { Progressbar } from './Progressbar';
import { Spinner } from './Spinner';
import { FileUploadType, PreviewType } from './types';
import { iOS } from '../../../utils/global.utils';

const ProgressBarWrapper = styled.div`
  overflow: auto;
  max-height: calc(100% - 115px - ${BOTTOM_NAVBAR_HEIGHT});
`;

const Root = styled.div`
  padding: 10px;
  background-color: #fff;
  flex: 1;
  height: calc(100vh - ${BOTTOM_NAVBAR_HEIGHT} - 70px);
`;

const CustomSpinner = styled(Spinner)`
  right: 11px;
  top: 9px;
`;

type Props = {
  onUpload: (files: FileUploadType[]) => void;
  onResetStatus?: () => void;
  tasks: UploadTaskWithID[];
  isLoading: boolean;
  done: boolean;
  open: boolean;
  onClose: () => void;
};

export const FileUploader = ({
  onUpload,
  onResetStatus,
  tasks,
  isLoading,
  done,
  open,
  onClose,
}: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [previews, setPreviews] = useState<PreviewType[]>([]);

  const handleUpload = useCallback(async (files: FileUploadType[]) => {
    setUploadedFiles(files);
  }, []);

  const handleSubmit = () => {
    onUpload(uploadedFiles);
  };

  const handleReset = () => {
    if (onResetStatus) {
      onResetStatus();
    }
    setCancelConfirmation(false);
    setUploadedFiles([]);
    onClose();
  };

  const handleCloseSwipe = () => {
    if (isLoading) {
      setCancelConfirmation(true);
      tasks.forEach((task) => task.task.pause());
    } else {
      tasks.forEach((task) => task.task.cancel());
      handleReset();
    }
  };

  const handleDialogResume = () => {
    tasks.forEach((task) => task.task.resume());
    setCancelConfirmation(false);
  };

  const handleCancelAll = () => {
    tasks.forEach((task) => task.task.cancel());
    handleReset();
  };

  const handleClose = () => {
    handleReset();
  };
  return (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor="bottom"
        open={open}
        onClose={handleCloseSwipe}
        disableSwipeToOpen
        onOpen={() => {}}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
      >
        <SwipeMenuHeader title="Télécharger" />
        {done ? (
          <PreviewFiles
            title="Tous les fichiers ont été correctement importer"
            previews={previews}
            onClose={handleClose}
            fileID="name"
          />
        ) : (
          <Root>
            <InputFile onChange={handleUpload} onUploadPreviews={setPreviews} />
            <ProgressBarWrapper>
              {tasks.map((task, key) => {
                if (task.loading === 'DONE') return null;
                return (
                  <Progressbar
                    key={key}
                    uploadTask={task}
                    uploadFile={uploadedFiles[task.id]}
                  />
                );
              })}
            </ProgressBarWrapper>
            <FixedBottomToolbar>
              <ButtonPill
                disabled={!uploadedFiles.length}
                style={{
                  flex: 1,
                  position: 'relative',
                }}
                type="button"
                onClick={isLoading ? handleCancelAll : handleSubmit}
              >
                {isLoading ? (
                  <span>
                    ANNULER TOUT
                    <CustomSpinner position="absolute" />
                  </span>
                ) : (
                  'TELECHARGER'
                )}
              </ButtonPill>
            </FixedBottomToolbar>
          </Root>
        )}
      </SwipeableDrawer>
      <DialogConfirmation
        open={cancelConfirmation}
        onReset={handleReset}
        onResume={handleDialogResume}
      />
    </>
  );
};
