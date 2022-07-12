import styled from '@emotion/styled';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLineUp,
  faGear,
  faGolfFlagHole,
  faPlayPause,
} from '@fortawesome/pro-duotone-svg-icons';
import { useState } from 'react';
import { theme } from '../../style/theme';

const Nav = styled.ul`
  label: BottomNavbar;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  height: ${BOTTOM_NAVBAR_HEIGHT};
  box-shadow: 0px -3px 10px 2px rgba(190, 189, 189, 0.8);
  z-index: 1;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 10px;
`;

const CustomLink = styled(Link)`
  display: flex;
  flex-direction: column;
`;

const IconSubtitle = styled.span`
  font-size: 13px;
  font-weight: bold;
  margin-top: 5px;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
`;

const NavItem = styled.li<{ color?: string }>`
  & a,
  button {
    text-decoration: none;
    color: ${({ color }) => color};
    font-size: 20px;
  }
`;

const menus = [
  {
    url: '',
    selectedColor: theme.headers.statistics.primary,
    label: 'Statistiques',
    icon: faChartLineUp,
  },
  {
    url: 'trainings',
    selectedColor: theme.headers.trainings.primary,
    label: 'Entraînements',
    icon: faGolfFlagHole,
  },
  {
    url: 'games',
    selectedColor: theme.headers.games.primary,
    label: 'Jouer',
    icon: faPlayPause,
  },
  {
    url: 'admin',
    selectedColor: theme.headers.statistics.primary,
    label: 'Configuration',
    icon: faGear,
  },
];
export const BottomNavbar = () => {
  const [selectedMenu, setSelectedMenu] = useState('');

  return (
    <Nav>
      {menus.map((menu, key) => {
        return (
          <NavItem
            key={key}
            onClick={() => setSelectedMenu(menu.url)}
            color={
              menu.url === selectedMenu
                ? menu.selectedColor
                : theme.colors.deleteButton
            }>
            <CustomLink to={menu.url}>
              <IconWrapper>
                <FontAwesomeIcon icon={menu.icon} />
              </IconWrapper>
              <IconSubtitle>{menu.label}</IconSubtitle>
            </CustomLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};
