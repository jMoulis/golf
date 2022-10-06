// import React, { useMemo } from 'react';
// import {
//   getHolesScores,
//   getScoreBrut,

import { Flexbox } from 'components/commons';
import { ErrorBoundary } from 'components/Error/ErrorBoundary';
import { useUser } from 'components/User/useUser';
import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import styled from '@emotion/styled';

// } from '../../utils/scoreUtils';
// import { useGames } from '../Game/useGames';

const Root = styled.div`
  overflow: auto;
`;

export const Statistic = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<any>({ '9': {}, '18': {} });
  useEffect(() => {
    if (user?.stats) {
      const group = user.stats.reduce((acc: any, stat) => {
        if (!acc[stat.type]) {
          return {
            ...acc,
            [stat.type]: {
              gameCount: 1,
              ...stat,
            },
          };
        }
        // console.log(stat);

        const prevShotTypes = {
          ...acc[stat.type].shotTypes,
          regul: acc[stat.type].shotTypes.regul + stat.shotTypes.regul,
          bunker: acc[stat.type].shotTypes.bunker + stat.shotTypes.bunker,
          putt: acc[stat.type].shotTypes.putt + stat.shotTypes.putt,
          fairway: acc[stat.type].shotTypes.fairway + stat.shotTypes.fairway,
          penalty: acc[stat.type].shotTypes.penalty + stat.shotTypes.penalty,
        };
        const prevScoreType = {
          ...acc[stat.type].scoreType,
          eagles: acc[stat.type].scoreType.eagles + stat.scoreType.eagles,
          birdies: acc[stat.type].scoreType.birdies + stat.scoreType.birdies,
          pars: acc[stat.type].scoreType.pars + stat.scoreType.pars,
          boggeys: acc[stat.type].scoreType.boggeys + stat.scoreType.boggeys,
          double: acc[stat.type].scoreType.double + stat.scoreType.double,
          triple: acc[stat.type].scoreType.triple + stat.scoreType.triple,
        };

        return {
          ...acc,
          [stat.type]: {
            ...acc[stat.type],
            ...stat,
            gameCount: acc[stat.type].gameCount + 1,
            shotTypes: prevShotTypes,
            scoreType: prevScoreType,
            score: acc[stat.type].score + stat.score,
          },
        };
      }, {});

      setStats(group);
    }
  }, [user]);

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
      <Root>
        {Object.values(stats).map((entry: any, index) => {
          const scoreType = Object.keys(entry.scoreType).map((key) => ({
            id: key,
            label: key,
            value: entry.scoreType[key] / entry.gameCount,
          }));
          const totalHolesPlayed = entry.gameCount * entry.type;

          return (
            <Flexbox flexDirection="column" key={index}>
              <span>{entry.type}</span>
              <span>
                Score moyen: {Math.ceil(entry.score / entry.gameCount)}
              </span>
              <span style={{ height: '25rem' }}>
                <ResponsivePie
                  valueFormat=" >-.2f"
                  margin={{ top: 80, right: 80, bottom: 80, left: 80 }}
                  data={scoreType}
                  innerRadius={0.3}
                  arcLinkLabelsTextColor="#cf2626"
                />
              </span>
              <span>
                Fairways{' '}
                {Math.floor((entry.shotTypes.fairway / totalHolesPlayed) * 100)}
                %
              </span>
              <span>
                Regul{' '}
                {Math.floor((entry.shotTypes.regul / totalHolesPlayed) * 100)}%
              </span>
              <span>Putt {entry.shotTypes.putt / totalHolesPlayed}</span>
            </Flexbox>
          );
        })}
      </Root>
    </ErrorBoundary>
  );
};
