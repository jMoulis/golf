import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { BottomNavbar } from '../Home/BottomNavbar';
import { Page } from '../commons/Core/Page';

export const Homepage = () => {
  const [userSystem, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSystem) {
      navigate('/');
    }
  }, [userSystem, loading]);

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
