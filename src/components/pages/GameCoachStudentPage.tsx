import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../../style/theme';
import { Flexbox } from '../commons';
import { PageHeader } from '../commons/Core/PageHeader';
import { NavigationButton } from '../commons/Buttons/NavigationButton';
import { GamesList } from '../Game/GameBoard/GamesList/GamesList';
import { UserType } from '../types';
import { useUser } from '../User/useUser';

export const GameCoachStudentPage = () => {
  const { fetchOneUser } = useUser();
  const [student, setStudent] = useState<UserType | null>(null);

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchOneUser(userId).then((snap) => setStudent(snap));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const handleNavigationBack = () => {
    navigate(-1);
  };

  if (!userId) return null;

  return (
    <>
      <PageHeader backgroundColor={theme.headers.games.linear}>
        <Flexbox alignItems="center">
          <NavigationButton onClick={handleNavigationBack} />
          Parties - {student?.firstname}
        </Flexbox>
      </PageHeader>
      <GamesList userId={userId} />
    </>
  );
};
