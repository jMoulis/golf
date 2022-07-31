import { Link } from 'react-router-dom';
import { theme } from '../../style/theme';
import { PageHeader } from '../commons/Core/PageHeader';

export const TrainingIndex = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.trainings.linear}>
        Trainings
      </PageHeader>
      <div>
        <div>En cours de contruction... patience</div>
        <Link to="pelz">Pelz</Link>
      </div>
    </>
  );
};
