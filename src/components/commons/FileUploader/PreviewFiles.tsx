import styled from '@emotion/styled';
import { faImageSlash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FormEvent, useState } from 'react';
import { useFileStorage } from '../../../hooks/useFileStorage';
import { theme } from '../../../style/theme';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';
import { ButtonPill } from '../Buttons/ButtonPill';
import { DeleteButton } from '../Buttons/DeleteButton';
import { FixedBottomToolbar } from '../FixedBottomToolbar';
import { SwipableDefault } from '../SwipableDefault';
import { PreviewType, PreviewTypeWithStorageRef } from './types';
import { DrawingApp } from 'components/commons/VideoDrawingApp/DrawingApp';
import { VideoType } from 'components/Training/Session/types';

const Root = styled.div`
  margin: 5px;
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  height: calc(100% - ${BOTTOM_NAVBAR_HEIGHT} - 70px);
  overflow: auto;
`;
const Error = styled.span`
  height: 50px;
  width: 50px;
  min-width: 50px;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.error};
  margin: 5px 3px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
`;

const PreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: auto;
  box-shadow: ${theme.shadows.flatButton};
  margin: 5px;
  border-radius: 10px;
  padding: 5px;
`;

const Title = styled.span`
  font-weight: bold;
`;

const PreviewImage = styled.img`
  height: 50px;
  width: 50px;
  min-width: 50px;
  object-fit: cover;
  display: block;
  margin: 5px 3px;
  border-radius: 5px;
`;

const FileName = styled.span`
  font-size: 13px;
`;

type Props = {
  previews: (PreviewType | PreviewTypeWithStorageRef)[];
  onClose: () => void;
  onDelete?: (fileName?: string) => void;
  title?: string;
  fileID: string;
};

export const PreviewFiles = ({
  previews,
  onClose,
  title,
  onDelete,
  fileID,
}: Props) => {
  const [selectedPreview, setSelectedPreview] = useState<
    (PreviewTypeWithStorageRef | PreviewType) | null
  >(null);
  const { getFileURL, getFileAsBlob } = useFileStorage();
  const [detailImage, setDetailImage] = React.useState<string | null>(null);
  const [video, setVideo] = React.useState<VideoType | null>(null);

  const handleDelete = (
    event: FormEvent<HTMLButtonElement>,
    fileName: string
  ) => {
    event.stopPropagation();
    onDelete && onDelete(fileName);
  };

  const handleDisplayFile = async (
    preview?: PreviewTypeWithStorageRef | PreviewType
  ) => {
    setSelectedPreview(preview || null);
    if ((preview as PreviewTypeWithStorageRef)?.storageImageRef?.fullPath) {
      if (preview?.mimeType?.includes('image')) {
        const payload = await getFileURL(
          (preview as PreviewTypeWithStorageRef).storageImageRef.fullPath
        );
        return setDetailImage(payload);
      }
      if (preview?.mimeType?.includes('video')) {
        const payload = await getFileAsBlob(
          (preview as PreviewTypeWithStorageRef).storageImageRef.fullPath
        );
        if (payload) {
          setVideo({
            blob: payload,
            thumbnail: preview.url || '',
            name: preview.name || '',
          });
        }
      }
    }
  };

  return (
    <Root>
      {title ? <Title>{title}</Title> : null}
      {previews.map((preview, key) => (
        <PreviewWrapper
          key={key}
          onClick={() =>
            handleDisplayFile(preview as PreviewTypeWithStorageRef)
          }
        >
          {preview.url ? (
            <PreviewImage src={preview.url || ''} />
          ) : (
            <Error>
              <FontAwesomeIcon icon={faImageSlash} />
            </Error>
          )}
          <FileName>{preview.customName || preview.name}</FileName>
          {onDelete ? (
            <DeleteButton
              onClick={(event) => handleDelete(event, (preview as any)[fileID])}
            />
          ) : null}
        </PreviewWrapper>
      ))}
      <FixedBottomToolbar>
        <ButtonPill onClick={onClose}>FERMER</ButtonPill>
      </FixedBottomToolbar>
      {selectedPreview?.mimeType?.includes('image') ? (
        <SwipableDefault
          onOpen={() => {}}
          open={Boolean(detailImage)}
          title=""
          onClose={() => setDetailImage(null)}
        >
          {detailImage ? <img src={detailImage} /> : null}
        </SwipableDefault>
      ) : null}
      {selectedPreview?.mimeType?.includes('video') ? (
        video ? (
          // <video autoPlay src={detailImage} />
          <DrawingApp
            video={video}
            open={Boolean(video)}
            onClose={() => setVideo(null)}
            onDelete={() => {}}
          />
        ) : null
      ) : null}
    </Root>
  );
};
