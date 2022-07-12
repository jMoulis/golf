import { CoachPage } from '../pages/CoachPage';
import { CoursePage } from '../pages/CoursePage';
import { ThemePage } from '../pages/ThemePage';
import { ENUM_MENU_COMPONENT } from './enum';

export const RenderDrawerComponent = {
  [ENUM_MENU_COMPONENT.COACHES]: () => <CoachPage />,
  [ENUM_MENU_COMPONENT.COURSES]: () => <CoursePage />,
  [ENUM_MENU_COMPONENT.THEMES]: () => <ThemePage />,
};
