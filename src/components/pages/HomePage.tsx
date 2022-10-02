import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig/firebase';
import { BottomNavbar } from '../Home/BottomNavbar';
import { Page } from '../commons/Core/Page';

export const Homepage = () => {
  const [userSystem, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSystem) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSystem]);

  if (loading) return null;

  return (
    <>
      <Page>
        <Outlet />
      </Page>
      <BottomNavbar />
    </>
  );
};
