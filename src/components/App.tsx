import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './pages/HomePage';
import { TrainingPage } from './pages/TrainingPages/TrainingPage';
import { StatPage } from './pages/StatPage';
import styled from '@emotion/styled';
import { GamePage } from './pages/GamePages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPages/AdminPage';
import { ThemePage } from './pages/AdminPages/ThemePage';
import { CoursePage } from './pages/AdminPages/CoursePage';
import { CoachPage } from './pages/AdminPages/CoachPage';
import { TrainingIndex } from './pages/TrainingPages/TrainingIndex';
import { AdminIndex } from './pages/AdminPages/AdminIndex';
import { PelzPage } from './pages/TrainingPages/PelzPages/PelzPage';
import { useUser } from './User/useUser';
import { PelzCoachStudentPage } from './pages/TrainingPages/PelzPages/PelzCoachStudentPage';
import { GameCoachStudentPage } from './pages/GameCoachStudentPage';
import { theme } from '../style/theme';
import { CoachIndex } from './pages/commonPages/CoachIndex';
import { SessionPage } from './pages/TrainingPages/SessionPages/SessionPage';
import { SessionCoachStudentPage } from './pages/TrainingPages/SessionPages/SessionCoachStudentPage';

const Grid = styled.div`
  label: MainGrid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

function App() {
  const { user, getConnectedUser } = useUser();

  useEffect(() => {
    if (!user) {
      getConnectedUser();
    }
  }, [user, getConnectedUser]);

  return (
    <>
      <Grid>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="protected" element={<Homepage />}>
            <Route index element={<StatPage />} />
            <Route path="games" element={<GamePage />}>
              <Route
                index
                element={
                  <CoachIndex
                    title="Mes parties"
                    headerTheme={theme.headers.games.linear}
                  />
                }
              />
              <Route path=":userId" element={<GameCoachStudentPage />} />
            </Route>
            <Route path="trainings" element={<TrainingPage />}>
              <Route index element={<TrainingIndex />} />
              <Route path="pelz" element={<PelzPage />}>
                <Route
                  index
                  element={
                    <CoachIndex
                      title="Mes tests"
                      headerTheme={theme.headers.trainings.linear}
                    />
                  }
                />
                <Route path=":userId" element={<PelzCoachStudentPage />} />
              </Route>
              <Route path="session" element={<SessionPage />}>
                <Route
                  index
                  element={
                    <CoachIndex
                      title="Mes sessions"
                      headerTheme={theme.headers.trainings.linear}
                    />
                  }
                />
                <Route path=":userId" element={<SessionCoachStudentPage />} />
              </Route>
            </Route>
            <Route path="admin" element={<AdminPage />}>
              <Route index element={<AdminIndex />} />
              <Route path="themes" element={<ThemePage />} />
              <Route path="courses" element={<CoursePage />} />
              <Route path="coaches" element={<CoachPage />} />
            </Route>
          </Route>
        </Routes>
      </Grid>
    </>
  );
}

export default App;
