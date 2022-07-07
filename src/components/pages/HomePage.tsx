import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { BottomNavbar } from '../Home/BottomNavbar';
import { TopNavbar } from '../Home/TopNavbar';
import styled from '@emotion/styled';
import { BOTTOM_NAVBAR_HEIGHT, TOP_NAVBAR_HEIGHT } from '../cssConstants';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT} - ${BOTTOM_NAVBAR_HEIGHT});
`;
export const Homepage = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) return null;

  return (
    <>
      <div>
        <TopNavbar />
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </div>
      <BottomNavbar />
    </>
  );
};
