import styled from '@emotion/styled';
import { Flexbox } from 'components/commons';
import { useConfig } from 'components/Game/ScoreCard/ShotForm/shotTypes';
import React, { useEffect, useMemo, useState } from 'react';
import { theme } from 'style/theme';
import { ResponsivePie } from '@nivo/pie';
import { UserStatType } from 'components/types';
import { scoresConfig } from 'utils/scoreUtils';
import { StatCardHeader } from './StatCardHeader';
import { StatCardShotTypes } from './StatCardShotTypes';

const updateEl = (
  aggregateKey: string,
  prevShots = {} as any,
  newShots = {} as any
) => {
  const prevShot = prevShots[aggregateKey] || {};
  const newShot = newShots[aggregateKey] || {};
  const payload = Object.keys(prevShot).reduce((acc: any, key: any) => {
    return { ...acc, [key]: (prevShot[key] || 0) + (newShot[key] || 0) };
  }, prevShot);
  return payload;
};

const Root = styled.div`
  overflow: auto;
`;

const Card = styled(Flexbox)`
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
  /* padding: 10px; */
`;

type Props = {
  userStats: UserStatType[];
};
export const StatCard = ({ userStats }: Props) => {
  const [stats, setStats] = useState<any>({ '9': {}, '18': {}, all: {} });
  const { shotTypes } = useConfig();

  const defaultAllStat = useMemo(() => {
    if (!shotTypes?.length) return null;
    return {
      gameCount: 1,
      score: 0,
      shotTypes: Object.fromEntries(
        shotTypes
          .filter((shot) => shot.toStat)
          .sort((a, b) => a.order - b.order)
          .map((shot) => [shot.type, 0])
      ),
      scoreType: {
        birdies: 0,
        boggeys: 0,
        double: 0,
        triple: 0,
        pars: 0,
      },
      totalHolesPlayed: 0,
    };
  }, [shotTypes]);

  useEffect(() => {
    if (userStats && shotTypes?.length) {
      const group = userStats.reduce(
        (acc: any, stat, index) => {
          const all = {
            ...acc.all,
            type: 0,
            gameCount: 1 + index,
            score: acc.all.score + stat.score,
            scoreType: updateEl('scoreType', acc.all, stat),
            totalHolesPlayed: acc.all.totalHolesPlayed + stat.type,
            shotTypes: updateEl('shotTypes', acc.all, stat),
          };
          // 28,222,2,1
          if (!acc[stat.type]) {
            return {
              ...acc,
              all,
              [stat.type]: {
                gameCount: 1,
                ...stat,
                totalHolesPlayed: stat.type,
              },
            };
          }
          return {
            ...acc,
            all,
            [stat.type]: {
              ...acc[stat.type],
              ...stat,
              gameCount: acc[stat.type].gameCount + 1,
              shotTypes: updateEl('shotTypes', acc[stat.type], stat),
              scoreType: updateEl('scoreType', acc[stat.type], stat),
              score: acc[stat.type].score + stat.score,
              totalHolesPlayed: acc[stat.type].totalHolesPlayed + stat.type,
            },
          };
        },
        {
          all: defaultAllStat,
          9: defaultAllStat,
          18: defaultAllStat,
        }
      );
      setStats(group);
    }
  }, [userStats, shotTypes, defaultAllStat]);

  const shotTypesOrder = useMemo(() => {
    return shotTypes
      ?.sort((a, b) => a.order - b.order)
      .filter((shot) => shot.toStat)
      .map((shot) => shot.type);
  }, [shotTypes]);

  return (
    <Root>
      {Object.values(stats).map((entry: any, index) => {
        if (!entry?.scoreType) return null;
        const { totalHolesPlayed } = entry;

        const scoreType = Object.keys(entry.scoreType).map((key) => ({
          id: key,
          label: key,
          value: entry.scoreType[key] / totalHolesPlayed,
          backgroundColor: (scoresConfig as any)[key]?.bk,
          color: (scoresConfig as any)[key]?.color,
        }));

        return (
          <Card flexDirection="column" key={index}>
            <StatCardHeader entry={entry} />
            <Flexbox>
              {shotTypesOrder.map((key, i) => (
                <StatCardShotTypes
                  key={i}
                  shotKey={key}
                  entry={entry}
                  totalHolesPlayed={totalHolesPlayed}
                />
              ))}
            </Flexbox>
            <span style={{ height: '12rem' }}>
              <ResponsivePie
                valueFormat=" >-.0%"
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                data={scoreType}
                innerRadius={0.3}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsDiagonalLength={6}
                arcLinkLabelsStraightLength={7}
                cornerRadius={4}
                padAngle={0.7}
                arcLabelsTextColor="#fff"
                colors={{ datum: 'data.backgroundColor' }}
              />
            </span>
          </Card>
        );
      })}
    </Root>
  );
};
