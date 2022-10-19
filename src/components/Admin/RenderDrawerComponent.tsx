import React from 'react';
import { CoachPage } from '../pages/AdminPages/CoachPage';
import { CoursePage } from '../pages/AdminPages/CoursePage';
import { ThemePage } from '../pages/AdminPages/ThemePage';
import { ENUM_MENU_COMPONENT } from './enum';

export const RenderDrawerComponent = {
  [ENUM_MENU_COMPONENT.COACHES]: () => <CoachPage />,
  [ENUM_MENU_COMPONENT.COURSES]: () => <CoursePage />,
  [ENUM_MENU_COMPONENT.THEMES]: () => <ThemePage />,
};
