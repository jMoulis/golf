import styled from '@emotion/styled';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { theme } from '../style/theme';

const Nav = styled.ul`
  display: flex;
  background-color: ${theme.colors.pink};
`;

const NavItem = styled.li`
  padding: 1rem;
  & a {
    text-decoration: none;
    color: #fff;
  }
`;

type Props = {};

export const Homepage = (props: Props) => {
  return (
    <>
      <Nav>
        <NavItem>
          <Link to='/'>Home</Link>
        </NavItem>
        <NavItem>
          <Link to='/trainings'>Training</Link>
        </NavItem>
        <NavItem>
          <Link to='/games'>Play</Link>
        </NavItem>
        <NavItem>
          <Link to='/admin'>Admin</Link>
        </NavItem>
      </Nav>
      <Outlet />
    </>
  );
};
