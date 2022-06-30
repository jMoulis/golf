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

const Grid = styled.div`
  display: grid;
  grid-template-rows: 40px 1fr;
  height: 100vh;
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
          <Route path='admin' element={<AddCourse />} />
        </Route>
      </Routes>
    </Grid>
  );
}

export default App;
