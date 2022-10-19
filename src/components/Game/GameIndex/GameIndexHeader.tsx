import React from 'react';
import { theme } from 'style/theme';
import { Flexbox } from 'components/commons';
import { PageHeader } from 'components/commons/Core/PageHeader';
import { PageHeaderTitle } from 'components/commons/Core/PageHeaderTitle';

export const GameIndexHeader = () => {
  return (
    <PageHeader backgroundColor={theme.headers.games.linear}>
      <Flexbox style={{ maxHeight: '100%' }} flex="1" flexDirection="column">
        <PageHeaderTitle>Parties</PageHeaderTitle>
      </Flexbox>
    </PageHeader>
  );
};
