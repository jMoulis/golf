import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { theme } from '../../../style/theme';
import { PageHeader } from '../../commons/Core/PageHeader';
import { GamesList } from '../../Game/GameBoard/GamesList/GamesList';
import { useUser } from '../../User/useUser';

export const GamePage = () => {
  const { user } = useUser();

  const isCoach = useMemo(() => {
    return user?.roles?.includes('coach');
  }, [user?.roles]);

  if (!user?.id) return null;

  console.log(isCoach);
  return (
    <>
      {!isCoach ? (
        <>
          <PageHeader backgroundColor={theme.headers.games.linear}>
            Games
          </PageHeader>
          <GamesList userId={user.id} />
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};
