import React from 'react';
import { NewGame } from './Game/NewGame/NewGame';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './pages/HomePage';
import { TrainingPage } from './pages/TrainingPage';
import { GameBoard } from './Game/GameBoard/GameBoard';
import { LandingPage } from './pages/LandingPage';
import styled from '@emotion/styled';
import { GameIndex } from './Game/GameIndex';
import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ThemePage } from './pages/ThemePage';
import { CoursePage } from './pages/CoursePage';
import { CoachPage } from './pages/CoachPage';
import { TrainingIndex } from './Training/TrainingIndex';
import { NewTraining } from './Training/NewTraining';
import { EditTraining } from './Training/EditTraining';

const Grid = styled.div`
  label: MainGrid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

function App() {
  return (
    <Grid>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='protected' element={<Homepage />}>
          <Route index element={<LandingPage />} />
          <Route path='games' element={<GamePage />}>
            <Route index element={<GameIndex />} />
            <Route path='new' element={<NewGame />} />
            <Route path=':gameId' element={<GameBoard />} />
          </Route>
          <Route path='trainings' element={<TrainingPage />}>
            <Route index element={<TrainingIndex />} />
            <Route path='new' element={<NewTraining />} />
            <Route path=':trainingId' element={<EditTraining />} />
          </Route>
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
