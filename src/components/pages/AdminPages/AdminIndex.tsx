import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { ENUM_MENU_COMPONENT } from '../../Admin/enum';
import { AdminDrawer } from '../../Admin/AdminDrawer';
import GolfCourseImage from '../../../assets/images/golf-field.png';
import GolfCoachImage from '../../../assets/images/golf-coach.png';
import GolfThemeImage from '../../../assets/images/golf-theme.png';

import { theme } from '../../../style/theme';
import { AdminMenuType } from '../../Admin/types';

const Root = styled.div`
  margin: 10px;
`;
const Navigation = styled.nav`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const NavigationCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: auto;
  flex: 1;
  min-width: 200px;
  max-width: 350px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  align-items: center;
  box-shadow: ${theme.shadows.listItem};
`;

export const AdminIndex = () => {
  const menus: AdminMenuType[] = useMemo(() => {
    return [
      {
        label: 'Thèmatiques',
        component: ENUM_MENU_COMPONENT.THEMES,
        img: GolfThemeImage,
      },
      {
        label: 'Parcours',
        component: ENUM_MENU_COMPONENT.COURSES,
        img: GolfCourseImage,
      },
      {
        label: 'Coaches',
        component: ENUM_MENU_COMPONENT.COACHES,
        img: GolfCoachImage,
      },
    ];
  }, []);

  const [selectedMenu, setSelectedMenu] = useState<AdminMenuType | null>(null);

  return (
    <Root>
      <Navigation>
        {menus.map((menu, key) => (
          <NavigationCard key={key} onClick={() => setSelectedMenu(menu)}>
            {menu.img ? (
              <img
                style={{
                  borderRadius: '300px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  height: '100px',
                  width: '100px',
                  boxShadow: theme.shadows.flatButton,
                }}
                alt={menu.label}
                src={menu.img}
              />
            ) : null}
            <span
              style={{
                fontSize: '20px',
                textTransform: 'uppercase',
                fontWeight: '700',
              }}
            >
              {menu.label}
            </span>
          </NavigationCard>
        ))}
      </Navigation>
      <AdminDrawer
        selectedMenu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
      />
    </Root>
  );
};
