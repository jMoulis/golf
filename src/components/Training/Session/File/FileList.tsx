import styled from '@emotion/styled';
import { faPaperclipVertical } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
} from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { storageErrors } from '../../../../utils/storageErrors';
import { Button } from '../../../commons';
import { Alerts } from '../../../commons/Alerts';
import { PreviewFiles } from '../../../commons/FileUploader/PreviewFiles';
import { PreviewTypeWithStorageRef } from '../../../commons/FileUploader/types';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { DocumentType } from '../types';

const DisplayButton = styled(Button)`
  font-size: 20px;
`;

const Label = styled.span`
  display: inline-block;
  font-size: 14px;
  margin-left: 5px;
`;

type Props = {
  files: DocumentType[];
  sessionID?: string;
  onDelete: (fileRef: StorageReference, thumbnailRef: StorageReference) => void;
};

export const FileList = ({ files, sessionID, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewTypeWithStorageRef[]>([]);
  // 1659695509059-5E0D8695-8F0C-4ED6-96CB-597C0E038640-jpeg
  const builtPreviews: (
    files: DocumentType[],
    idSession: string
  ) => Promise<PreviewTypeWithStorageRef>[] = useCallback(
    (incomingFiles, idSession) => {
      const storage = getStorage();
      return incomingFiles.map(async (file) => {
        const storageThumbnailRef = ref(storage, `/${file.thumbnail}`);
        const storageImageRef = ref(
          storage,
          `sessions/${idSession}/${file.name}`
        );
        const preview: PreviewTypeWithStorageRef = {
          name: file.name,
          storageThumbnailRef,
          storageImageRef,
        };
        const payload = await getDownloadURL(storageThumbnailRef).catch(
          (error) => storageErrors(error, 'Miniature')
        );

        if ((payload as any).ERROR) {
          setError((payload as any).ERROR);
        } else {
          preview.url = (payload as any) || undefined;
        }
        return preview;
      });
    },
    []
  );

  useEffect(() => {
    if (open && sessionID) {
      const previews = builtPreviews(files, sessionID);
      Promise.all(previews).then((data) => {
        setPreviews(data);
      });
      // .catch((error) => setError(error.message));
    } else {
      setPreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, sessionID, open]);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleDelete = (fileName?: string) => {
    if (!fileName) return null;
    const file = previews.find((prevFile) => prevFile.name === fileName);
    if (file) {
      onDelete(file.storageImageRef, file.storageThumbnailRef);
    }
  };

  return (
    <div className="FileList">
      <DisplayButton onClick={handleOpen}>
        <FontAwesomeIcon icon={faPaperclipVertical} />
        <Label>{`${files.length} pièces jointes`}</Label>
      </DisplayButton>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
      >
        <SwipeMenuHeader title="Liste des fichiers" />
        <PreviewFiles
          title=""
          onClose={handleClose}
          previews={previews}
          onDelete={handleDelete}
          fileID="name"
        />
        <Alerts
          open={Boolean(error)}
          onClose={() => setError(null)}
          message={error || 'Error'}
          severity="error"
        />
      </SwipeableDrawer>
    </div>
  );
};
