import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';

export const LandingPage = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.statistics.linear}>
        Landing
      </PageHeader>
    </>
  );
};
