import styled from '@emotion/styled';
import { ErrorBoundary } from 'components/Error/ErrorBoundary';
import { ENUM_TAB_STAT } from 'components/Statistic/enums';
import { Handicap } from 'components/Statistic/Handicap';
import { StatCard } from 'components/Statistic/StatCard';
import { Toolbar } from 'components/Statistic/Toolbar';
import { useUser } from 'components/User/useUser';
import React, { useState } from 'react';
import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';

const Root = styled.div`
  overflow: auto;
`;

export const StatPage = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState<ENUM_TAB_STAT>(
    ENUM_TAB_STAT.SCORE
  );

  return (
    <>
      <PageHeader backgroundColor={theme.headers.statistics.linear}>
        Statistiques
        <Handicap userStats={user?.stats} />
        <Toolbar onSelect={setSelectedTab} selectedTab={selectedTab} />
      </PageHeader>

      <ErrorBoundary>
        <Root>
          {selectedTab === ENUM_TAB_STAT.SCORE ? (
            <StatCard userStats={user?.stats || []} />
          ) : null}
        </Root>
      </ErrorBoundary>
    </>
  );
};
