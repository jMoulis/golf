import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageHeader } from '../commons/Core/PageHeader';
import { theme } from '../../style/theme';
import styled from '@emotion/styled';

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

export const AdminPage = () => {
  return (
    <>
      <PageHeader backgroundColor={theme.headers.admin.linear}>
        <HeaderTitle>Configuration</HeaderTitle>
      </PageHeader>
      <Content>
        <Outlet />
      </Content>
    </>
  );
};
