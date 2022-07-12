import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { ENUM_MENU_COMPONENT } from './enum';
import { AdminDrawer } from './AdminDrawer';

const Navigation = styled.nav`
  display: flex;
  justify-content: space-around;
`;

const NavigationCard = styled.div`
  display: flex;
  background-color: #fff;
  height: 150px;
  width: 100px;
  border-radius: 10px;
`;

type Props = {};

export const AdminIndex = (props: Props) => {
  const menus = useMemo(() => {
    return [
      {
        label: 'Themes',
        component: ENUM_MENU_COMPONENT.THEMES,
      },
      {
        label: 'Parcours',
        component: ENUM_MENU_COMPONENT.COURSES,
      },
      {
        label: 'Coaches',
        component: ENUM_MENU_COMPONENT.COACHES,
      },
    ];
  }, []);
  const [menuComponent, setMenuComponent] =
    useState<ENUM_MENU_COMPONENT | null>(null);
  return (
    <div>
      <Navigation>
        {menus.map((menu, key) => (
          <NavigationCard
            key={key}
            onClick={() => setMenuComponent(menu.component)}>
            <span>{menu.label}</span>
          </NavigationCard>
        ))}
      </Navigation>
      <AdminDrawer
        selectedComponent={menuComponent}
        onSelectMenu={setMenuComponent}
      />
    </div>
  );
};
