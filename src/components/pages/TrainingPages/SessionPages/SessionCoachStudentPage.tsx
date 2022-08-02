import { theme } from '../../../../style/theme';
import { CoachPageHeader } from '../../../Coach/CoachPageHeader';
import { useCoachPage } from '../../../Coach/useCoachPage';
import { SessionList } from '../../../Training/Session/SessionList';

export const SessionCoachStudentPage = () => {
  const { student, onNavigateBack } = useCoachPage();

  if (!student?.id) return null;

  return (
    <>
      <CoachPageHeader
        headerTheme={theme.headers.trainings.linear}
        headerTitle={`Sessions d'entraînement - ${student?.firstname}`}
        onNavigate={onNavigateBack}
      />
      <SessionList userId={student.id} />
    </>
  );
};
