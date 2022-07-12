import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageHeader } from '../commons/Core/PageHeader';
import { theme } from '../../style/theme';
import styled from '@emotion/styled';
import { Tab } from '../commons/TabNavigation/Tab';

const Navigation = styled.nav`
  display: flex;
  justify-content: space-around;
`;
const Content = styled.div`
  flex: 1;
  background-color: ${theme.colors.backgroundPage};
  position: relative;
  max-height: 90vh;
  overflow: auto;
`;
const HeaderTitle = styled.span`
  text-align: center;
  text-transform: uppercase;
`;
const CustomLink = styled(Link)`
  font-weight: bold;
`;

export const AdminPage = () => {
  const { pathname } = useLocation();
  return (
    <>
      <PageHeader backgroundColor={theme.headers.admin.linear}>
        <HeaderTitle>Configuration</HeaderTitle>
        <Navigation>
          <Tab
            selected={pathname.includes('themes')}
            color={theme.headers.admin.primary}>
            <CustomLink to='themes'>Themes</CustomLink>
          </Tab>
          <Tab
            selected={pathname.includes('courses')}
            color={theme.headers.admin.primary}>
            <CustomLink to='courses'>Courses</CustomLink>
          </Tab>
          <Tab
            selected={pathname.includes('coaches')}
            color={theme.headers.admin.primary}>
            <CustomLink to='coaches'>Coaches</CustomLink>
          </Tab>
        </Navigation>
      </PageHeader>
      <Content>
        <Outlet />
      </Content>
    </>
  );
};
