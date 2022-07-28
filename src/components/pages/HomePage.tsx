import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { BottomNavbar } from '../Home/BottomNavbar';
import { Page } from '../commons/Core/Page';

export const Homepage = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <>
      {/* <TopNavbar /> */}
      <Page>
        <Outlet />
      </Page>
      <BottomNavbar />
    </>
  );
};
