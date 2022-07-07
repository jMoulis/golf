import React from 'react';
import { NewGame } from './Game/NewGame';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './pages/HomePage';
import { Training } from './Training';
import { GameBoard } from './Game/GameBoard/GameBoard';
import { LandingPage } from './pages/LandingPage';
import styled from '@emotion/styled';
import { GamePage } from './pages/GamePage';
import { GameIndex } from './Game/GameIndex';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ThemePage } from './pages/ThemePage';
import { CoursePage } from './pages/CoursePage';
import { CoachPage } from './pages/CoachPage';
import { PreviousGamePage } from './pages/PreviousGamePage';
import { PreviousPage } from './pages/PreviousPage';

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
`;

function App() {
  return (
    <Grid>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='protected' element={<Homepage />}>
          <Route index element={<LandingPage />} />
          <Route path='games' element={<GameIndex />}>
            <Route index element={<GamePage />} />
            <Route path='new' element={<NewGame />} />
            <Route path='list' element={<PreviousPage />}>
              <Route index element={<PreviousGamePage />} />
              <Route path=':gameId' element={<GameBoard />} />
            </Route>
          </Route>
          <Route path='trainings' element={<Training />} />
          <Route path='admin' element={<AdminPage />}>
            <Route path='themes' element={<ThemePage />} />
            <Route path='courses' element={<CoursePage />} />
            <Route path='coaches' element={<CoachPage />} />
          </Route>
        </Route>
      </Routes>
    </Grid>
  );
}

export default App;
