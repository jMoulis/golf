import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { theme } from '../style/theme';
import { Button } from './commons';
import { logout } from '../auth/authActions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Nav = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${theme.colors.pink};
`;

const NavItem = styled.li`
  & a {
    text-decoration: none;
    color: #fff;
  }
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
      <Nav>
        <NavItem>
          <Link to=''>Home</Link>
        </NavItem>
        <NavItem>
          <Link to='trainings'>Training</Link>
        </NavItem>
        <NavItem>
          <Link to='games'>Play</Link>
        </NavItem>
        <NavItem>
          <Link to='admin'>Admin</Link>
        </NavItem>
        <NavItem>
          <Button onClick={logout}>Lougout</Button>
        </NavItem>
      </Nav>
      <Outlet />
    </>
  );
};
