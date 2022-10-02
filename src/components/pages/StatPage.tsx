import { ErrorBoundary } from 'components/Error/ErrorBoundary';
import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';
import { Statistic } from '../Statistic/Statistic';

export const StatPage = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.statistics.linear}>
        Statistiques
      </PageHeader>
      <ErrorBoundary>
        <Statistic />
      </ErrorBoundary>
    </>
  );
};
