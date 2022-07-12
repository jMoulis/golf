import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';

export const TrainingIndex = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.trainings.linear}>
        Trainings
      </PageHeader>
    </>
  );
};
