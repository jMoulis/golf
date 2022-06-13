import React from 'react';
import { NewGame } from './Game/NewGame';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './Homepage';
import { Training } from './Training';
import { GameBoard } from './Game/GameBoard';
import { AddCourse } from './AddCourse';
import { Landing } from './Landing';
import styled from '@emotion/styled';
import { Games } from './Game/Games';
import { GameIndex } from './Game/GameIndex';

const Grid = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  min-height: 100%;
`;

function App() {
  return (
    <Grid>
      <Routes>
        <Route path='/' element={<Homepage />}>
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
