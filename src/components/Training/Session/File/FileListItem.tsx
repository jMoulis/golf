import styled from '@emotion/styled';
import React from 'react';
import { DocumentType } from '../types';

const Root = styled.div``;

const FileName = styled.span`
  font-size: 13px;
`;

type Props = {
  file: DocumentType;
};

export const FileListItem = ({ file }: Props) => {
  return (
    <Root>
      <FileName>{file.name}</FileName>
    </Root>
  );
};
