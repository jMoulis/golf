// import React, { useMemo } from 'react';
// import {
//   getHolesScores,
//   getScoreBrut,

import { ErrorBoundary } from 'components/Error/ErrorBoundary';

// } from '../../utils/scoreUtils';
// import { useGames } from '../Game/useGames';

export const Statistic = () => {
  // const { games } = useGames();
  // const getGamesHoles = useMemo(() => {

  //   const totalStroke = games.reduce(
  //     (acc: number, game) => acc + (game.strokeBrut || 0),
  //     0,
  //   );
  //   console.log(totalStroke / games.length);
  //   const holes = games.map((game) => Object.values(game.holes)).flat();
  //   const scores = getHolesScores(holes);
  //   const brut = getScoreBrut(holes);
  //   console.log(brut);
  // }, [games]);

  /**
   * getTotalStats
   * pars/birdies...
   * putts
   * fairWays
   * Regul
   * Stroke by course type
   *
   * Get stat by courseRef
   */

  return (
    <ErrorBoundary>
      <div>En cours de contruction... patience</div>
    </ErrorBoundary>
  );
};
