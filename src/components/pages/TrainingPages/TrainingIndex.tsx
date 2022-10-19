import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../../style/theme';
import { Flexbox } from '../../commons';
import { PageHeader } from '../../commons/Core/PageHeader';

const Root = styled(Flexbox)`
  margin: 10px;
`;

const TrainingTile = styled(Flexbox)`
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
  height: 100px;
  width: 100px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin: 10px;
`;

export const TrainingIndex = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.trainings.linear}>
        Trainings
      </PageHeader>
      <Root>
        <Link to="pelz">
          <TrainingTile>Pelz</TrainingTile>
        </Link>
        <Link to="session">
          <TrainingTile>Sessions</TrainingTile>
        </Link>
      </Root>
    </>
  );
};
