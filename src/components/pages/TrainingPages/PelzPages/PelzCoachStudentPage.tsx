import { theme } from '../../../../style/theme';
import { CoachPageHeader } from '../../../Coach/CoachPageHeader';
import { useCoachPage } from '../../../Coach/useCoachPage';
import { PelzList } from '../../../Training/Pelz/PelzList/PelzList';

export const PelzCoachStudentPage = () => {
  const { student, onNavigateBack } = useCoachPage();

  if (!student?.id) return null;

  return (
    <>
      <CoachPageHeader
        headerTheme={theme.headers.trainings.linear}
        headerTitle={`Test Pelz - ${student?.firstname}`}
        onNavigate={onNavigateBack}
      />
      <PelzList userId={student.id} />
    </>
  );
};
