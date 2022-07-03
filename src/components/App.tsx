import React from 'react';
import { NewGame } from './Game/NewGame';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './Homepage';
import { Training } from './Training';
import { GameBoard } from './Game/GameBoard/GameBoard';
import { AddCourse } from './AddCourse';
import { Landing } from './Landing';
import styled from '@emotion/styled';
import { Games } from './Game/Games';
import { GameIndex } from './Game/GameIndex';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ThemePage } from './pages/ThemePage';
import { CoursePage } from './pages/CoursePage';

const Grid = styled.div`
  display: grid;
  grid-template-rows: 50px calc(100% - 50px);
  height: 100%;
  /* /* height: 100vh; */
  overflow: hidden;
`;

function App() {
  return (
    <Grid>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='protected' element={<Homepage />}>
          <Route index element={<Landing />} />
          <Route path='games' element={<GameIndex />}>
            <Route index element={<Games />} />
            <Route path='new' element={<NewGame />} />
            <Route path=':gameId' element={<GameBoard />} />
          </Route>
          <Route path='trainings' element={<Training />} />
          <Route path='admin' element={<AdminPage />}>
            <Route path='themes' element={<ThemePage />} />
            <Route path='courses' element={<CoursePage />} />
          </Route>
        </Route>
      </Routes>
    </Grid>
  );
}

export default App;
