import styled from '@emotion/styled';
import { faSquare } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { theme } from '../../../../../style/theme';

const Root = styled.div`
  position: relative;
  margin: 0 5px;
`;

const Count = styled.span`
  position: absolute;
  font-weight: bold;
  top: 5px;
  left: 9px;
  color: ${theme.colors.saveButton};
`;

type Props = {
  status: boolean;
  count: number;
};

export const TaskCheckStatus = ({ status, count }: Props) => {
  return (
    <Root>
      <FontAwesomeIcon
        color={status ? theme.colors.success : theme.colors.error}
        icon={faSquare}
        size="2x"
      />
      <Count>{count}</Count>
    </Root>
  );
};
