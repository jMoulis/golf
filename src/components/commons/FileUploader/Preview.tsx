import styled from '@emotion/styled';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useThumbnail } from '../../../hooks/useThumbnail';
import { generatorsKey } from '../../../utils/global.utils';
import { Spinner } from './Spinner';
import mime from 'mime';
import { Flexbox } from '../Flexbox';
import { theme } from '../../../style/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImageSlash } from '@fortawesome/pro-duotone-svg-icons';
import { Dialog } from '@mui/material';
import { DialogHeader } from '../Dialog/DialogHeader';
import { DeleteButton } from '../Buttons/DeleteButton';
import { Input } from '../Input';
import { ButtonPill } from '../Buttons/ButtonPill';
import { FileUploadType, PreviewType } from './types';

const Label = styled.span``;

const Image = styled.img`
  height: 50px;
  width: 50px;
  min-width: 50px;
  object-fit: cover;
  display: block;
  margin: 5px 3px;
  border-radius: 5px;
`;
const DefaultWrapper = styled.div`
  height: 50px;
  width: 50px;
  display: block;
  margin: 5px 3px;
  border-radius: 5px;
`;
const FileName = styled.p`
  font-size: 13px;
  text-align: center;
`;

const CustomSpinner = styled(Spinner)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Error = styled.span`
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.error};
  margin: 5px 3px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
`;

type Props = {
  onDeleteFile: (file: FileUploadType) => void;
  files: FileUploadType[];
  onEditFile: (editedFile: FileUploadType) => void;
  onUploadPreviews: (previews: PreviewType[]) => void;
};

export const Preview = ({
  onDeleteFile,
  files,
  onEditFile,
  onUploadPreviews,
}: Props) => {
  const [showPreview, setShowPreview] = useState<PreviewType | undefined>();
  const [previews, setPreviews] = useState<PreviewType[]>([]);
  const { generators } = useThumbnail();

  const buildPreviews = useCallback(
    (incomingFiles: FileUploadType[]) => {
      incomingFiles.forEach(async (file) => {
        if (!file.file) return null;

        const key = generatorsKey(file.file?.type);

        setPreviews((prev) => {
          if (prev.some((prevFile) => prevFile.name === file.file?.name))
            return prev;
          return [
            ...prev,
            {
              name: file.file?.name,
              url: '',
              loading: 'LOADING',
              file: file.file,
            },
          ];
        });

        if (typeof generators[key] !== 'function') return;

        const extension = (mime as any).getExtension(file.file?.type);

        const payload = await generators[key](
          file.file,
          file.file.name,
          extension
        );

        if (!payload[0]) {
          setPreviews((prev) =>
            prev.map((prevFile) => {
              if (prevFile.name === file.file?.name) {
                return { ...prevFile, url: '', loading: 'ERROR' };
              }
              return prevFile;
            })
          );
        } else {
          setPreviews((prev) =>
            prev.map((prevFile) => {
              if (prevFile.name === file.file?.name) {
                return { ...prevFile, url: payload?.[2], loading: 'DONE' };
              }
              return prevFile;
            })
          );
        }
      }, []);
    },
    [generators]
  );

  useEffect(() => {
    buildPreviews(files);
  }, [buildPreviews, files]);

  useEffect(() => {
    onUploadPreviews(previews);
  }, [onUploadPreviews, previews]);

  const handleRemoveFile = (preview: PreviewType) => {
    const fileToRemove = files.find((file) => file.file?.name === preview.name);
    if (fileToRemove) {
      onDeleteFile(fileToRemove);
      setPreviews((prev) =>
        prev.filter((prevFile) => prevFile.name !== preview.name)
      );
    }
    setShowPreview(undefined);
  };

  const handleNameChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const updatedPreview: PreviewType = {
      ...showPreview,
      customName: value,
    };
    setShowPreview(updatedPreview);
    setPreviews((prev) =>
      prev.map((prevPreview) => {
        if (prevPreview.name === updatedPreview.name) {
          return updatedPreview;
        }
        return prevPreview;
      })
    );
  };

  const handleSave = () => {
    if (showPreview && showPreview.file) {
      onEditFile({
        customName: showPreview.customName,
        file: showPreview.file,
      });
      setShowPreview(undefined);
    }
  };

  return (
    <Flexbox
      style={{
        overflow: 'auto',
      }}
    >
      {previews.map((preview, key) => (
        <div key={key} style={{ position: 'relative' }}>
          {preview.loading === 'LOADING' ? (
            <DefaultWrapper>
              <CustomSpinner position="absolute" />
            </DefaultWrapper>
          ) : preview.loading === 'ERROR' ? (
            <Error onClick={() => setShowPreview(preview)}>
              <FontAwesomeIcon icon={faImageSlash} />
            </Error>
          ) : (
            <>
              <Image
                onClick={() => setShowPreview(preview)}
                src={preview.url}
              />
            </>
          )}
        </div>
      ))}
      <Dialog
        open={Boolean(showPreview)}
        onClose={() => setShowPreview(undefined)}
      >
        <DialogHeader
          title="Détail"
          onClose={() => setShowPreview(undefined)}
        />
        <Flexbox
          flexDirection="column"
          alignItems="center"
          style={{
            padding: '5px',
          }}
        >
          <Image
            style={{
              height: '100px',
              width: '100px',
            }}
            src={showPreview?.url}
          />
          <FileName>{showPreview?.name}</FileName>
          <Flexbox flexDirection="column">
            <Label>Nom personnalisé</Label>
            <Input
              placeholder="Nom de fichier personnalisé"
              value={showPreview?.customName || showPreview?.name || ''}
              onChange={handleNameChange}
            />
          </Flexbox>
          <Flexbox>
            <ButtonPill
              onClick={handleSave}
              style={{
                flex: 1,
              }}
            >
              MODIFIER
            </ButtonPill>
            <DeleteButton
              onClick={() => handleRemoveFile(showPreview as any)}
            />
          </Flexbox>
        </Flexbox>
      </Dialog>
    </Flexbox>
  );
};
