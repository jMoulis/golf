import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UserType } from '../types';
import { useUser } from '../User/useUser';

export const useCoachPage = () => {
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

  return {
    student,
    onNavigateBack: handleNavigationBack
  }
}