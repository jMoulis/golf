import React from 'react';
import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';
import { PelzList } from '../Training/Pelz/PelzList';

export const PelzPage = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.trainings.linear}>
        Test pelz
      </PageHeader>
      <PelzList />
    </>
  );
};
