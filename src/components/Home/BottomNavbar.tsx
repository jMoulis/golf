import styled from '@emotion/styled';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { theme } from '../../style/theme';
import { Link } from 'react-router-dom';

const Nav = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${theme.colors.pink};
  padding-bottom: 10px;
  border-radius: 10px 10px 0 0;
  height: ${BOTTOM_NAVBAR_HEIGHT};
  z-index: 1;
  mar
`;

const NavItem = styled.li`
  & a,
  button {
    text-decoration: none;
    color: #fff;
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
