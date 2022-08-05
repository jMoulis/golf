import styled from '@emotion/styled';
import { FormEvent, useRef, useState } from 'react';
import { Preview } from './Preview';
import { theme } from '../../../style/theme';
import { Flexbox } from '../Flexbox';
import { FileUploadType, PreviewType } from './types';

const Root = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: ${theme.colors.backgroundPage};
  border-radius: 10px;
  box-shadow: ${theme.shadows.flatButton};
  margin-bottom: 10px;
  flex-direction: column;
`;

const Input = styled.input`
  display: none;
`;
const UploadButton = styled.button``;

type Props = {
  onChange: (files: FileUploadType[]) => void;
  onUploadPreviews: (previews: PreviewType[]) => void;
};

export const InputFile = ({ onChange, onUploadPreviews }: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<FileUploadType[]>([]);

  const handleChange = async (event: FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (files) {
      const filesArray = Array.from(files).map((file) => ({
        file,
      }));
      const updatedSelectedFiles = [...selectedFiles, ...filesArray];
      setSelectedFiles(updatedSelectedFiles);
      onChange(updatedSelectedFiles);
    }
  };

  const hiddentFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    hiddentFileInputRef.current?.click();
  };

  const handleDeleteFile = (file: FileUploadType) => {
    const updatedSelectedFiles = selectedFiles.filter(
      (prevFile) => prevFile.file?.name !== file.file?.name
    );
    setSelectedFiles(updatedSelectedFiles);
    onChange(updatedSelectedFiles);
  };

  const handleEditFile = (file: FileUploadType) => {
    const updatedFiles = selectedFiles.map((prevFile) =>
      prevFile.file?.name === file?.file?.name
        ? {
            ...prevFile,
            customName: file.customName,
          }
        : prevFile
    );
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <Root>
      <Flexbox>
        <UploadButton onClick={handleClick}>Télécharger</UploadButton>
        <Input
          multiple
          ref={hiddentFileInputRef}
          type="file"
          onChange={handleChange}
        />
      </Flexbox>
      <Preview
        onDeleteFile={handleDeleteFile}
        files={selectedFiles}
        onEditFile={handleEditFile}
        onUploadPreviews={onUploadPreviews}
      />
    </Root>
  );
};
