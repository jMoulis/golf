import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../../../style/theme';
import { CloseButton } from '../Buttons/CloseButton';

const Root = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.blue};
  color: #fff;
  padding: 5px;
`;

type Props = {
  title: string;
  onClose: () => void;
  headerStyle?: any;
  buttonStyle?: any;
};

export const DialogHeader = ({
  title,
  onClose,
  headerStyle,
  buttonStyle,
}: Props) => {
  return (
    <Root style={headerStyle}>
      {title}
      <CloseButton buttonStyle={buttonStyle} onClick={onClose} />
    </Root>
  );
};
