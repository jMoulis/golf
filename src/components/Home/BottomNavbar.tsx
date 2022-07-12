import styled from '@emotion/styled';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { Link } from 'react-router-dom';

const Nav = styled.ul`
  label: BottomNavbar;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  padding-bottom: 10px;
  border-radius: 10px 10px 0 0;
  height: ${BOTTOM_NAVBAR_HEIGHT};
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  z-index: 1;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

const NavItem = styled.li`
  & a,
  button {
    text-decoration: none;
    color: gray;
    font-size: 20px;
  }
`;

export const BottomNavbar = () => {
  return (
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
    </Nav>
  );
};
