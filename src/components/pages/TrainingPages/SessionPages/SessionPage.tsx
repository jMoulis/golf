import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { theme } from '../../../../style/theme';
import { PageHeader } from '../../../commons/Core/PageHeader';
import { SessionList } from '../../../Training/Session/SessionList/SessionList';
import { useUser } from '../../../User/useUser';

export const SessionPage = () => {
  const { user } = useUser();

  const isCoach = useMemo(() => {
    return user?.roles?.includes('coach');
  }, [user?.roles]);

  if (!user?.id) return null;
  return (
    <>
      {!isCoach ? (
        <>
          <PageHeader backgroundColor={theme.headers.trainings.linear}>
            {`Sessions d'entraînements`}
          </PageHeader>
          <SessionList userId={user.id} />
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};
