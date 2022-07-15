import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { ENUM_MENU_COMPONENT } from './enum';
import { AdminDrawer } from './AdminDrawer';
import GolfCourseImage from '../../assets/images/golf-course.png';
import GolfCoachImage from '../../assets/images/golf-coach.png';
import GolfEvalImage from '../../assets/images/golf-eval.png';

import { theme } from '../../style/theme';
import { AdminMenuType } from './types';

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
  margin: 10px;
  border-radius: 10px;
  align-items: center;
  box-shadow: ${theme.shadows.listItem};
`;

type Props = {};

export const AdminIndex = (props: Props) => {
  const menus: AdminMenuType[] = useMemo(() => {
    return [
      {
        label: 'Thèmatiques',
        component: ENUM_MENU_COMPONENT.THEMES,
        img: GolfEvalImage,
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
                  flex: 1,
                  borderRadius: '10px 10px 0 0',
                  objectFit: 'cover',
                  objectPosition: 'center',
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
              }}>
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
