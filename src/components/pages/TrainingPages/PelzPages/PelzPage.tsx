import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { theme } from '../../../../style/theme';
import { PageHeader } from '../../../commons/Core/PageHeader';
import { PelzList } from '../../../Training/Pelz/PelzList/PelzList';
import { useUser } from '../../../User/useUser';

export const PelzPage = () => {
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
            Test pelz
          </PageHeader>
          <PelzList userId={user.id} />
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};
