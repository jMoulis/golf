import { Flexbox } from 'components/commons';
import { ErrorBoundary } from 'components/Error/ErrorBoundary';
import { useUser } from 'components/User/useUser';
import { useEffect, useMemo, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import styled from '@emotion/styled';
import { scoresConfig } from 'utils/scoreUtils';
import { theme } from 'style/theme';
import { useConfig } from 'components/Game/ScoreCard/ShotForm/shotTypes';
import { Tag } from 'components/Game/GameBoard/stylesComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const updateEl = (
  prevShots = {} as any,
  newShots = {} as any,
  aggregateKey: string
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

const Header = styled.header`
  background-color: ${theme.headers.statistics.primary};
  padding: 10px;
  border-radius: 5px 5px 0 0;
  margin-bottom: 10px;
  & p {
    color: #fff;
  }
`;

const CustomTag = styled(Tag)`
  height: 3rem;
  width: 3rem;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
`;

const Title = styled.span`
  font-weight: bold;
  display: block;
  text-transform: uppercase;
  color: #fff;
`;

const Card = styled(Flexbox)`
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
  /* padding: 10px; */
`;

export const Statistic = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<any>({ '9': {}, '18': {}, all: {} });
  const { shotTypesByTypes, shotTypes } = useConfig();

  const shotTypesOrder = useMemo(() => {
    return shotTypes
      .sort((a, b) => a.order - b.order)
      .filter((shot) => shot.toStat)
      .map((shot) => shot.type);
  }, [shotTypes]);

  const defaultAllStat = useMemo(() => {
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
    if (user?.stats) {
      const group = user.stats.reduce(
        (acc: any, stat, index) => {
          const all = {
            ...acc.all,
            type: 0,
            gameCount: 1 + index,
            score: acc.all.score + stat.score,
            scoreType: updateEl(acc.all, stat, 'scoreType'),
            totalHolesPlayed: acc.all.totalHolesPlayed + stat.type,
            shotTypes: updateEl(acc.all, stat, 'shotTypes'),
          };
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
              shotTypes: updateEl(acc[stat.type], stat, 'shotTypes'),
              scoreType: updateEl(acc[stat.type], stat, 'scoreType'),
              score: acc[stat.type].score + stat.score,
              totalHolesPlayed: acc[stat.type].totalHolesPlayed + stat.type,
            },
          };
        },
        {
          all: defaultAllStat,
        }
      );
      setStats(group);
    }
  }, [user?.stats]);

  return (
    <ErrorBoundary>
      <Root>
        {Object.values(stats).map((entry: any, index) => {
          if (!entry?.scoreType) return null;
          const totalHolesPlayed = entry.totalHolesPlayed;

          const scoreType = Object.keys(entry.scoreType).map((key) => ({
            id: key,
            label: key,
            value: entry.scoreType[key] / totalHolesPlayed,
            backgroundColor: (scoresConfig as any)[key]?.bk,
            color: (scoresConfig as any)[key]?.color,
          }));

          return (
            <Card flexDirection="column" key={index}>
              {entry.type ? (
                <Header>
                  <Title>{`${entry.type} Trous`}</Title>
                  <p>Total parties jouées: {entry.gameCount}</p>
                  <p>Score brut: {Math.ceil(entry.score / entry.gameCount)}</p>
                </Header>
              ) : (
                <Header>
                  <Title>Tout type confondus</Title>
                  <p>Total parties jouées: {entry.gameCount}</p>
                </Header>
              )}
              <Flexbox>
                {shotTypesOrder.map((key) => (
                  <CustomTag
                    scoreColor={shotTypesByTypes?.[key] as any}
                    key={key}
                  >
                    <>
                      {shotTypesByTypes?.[key]?.icon ? (
                        <FontAwesomeIcon icon={shotTypesByTypes?.[key]?.icon} />
                      ) : null}
                    </>
                    <span>
                      {key !== 'putt'
                        ? `${Math.floor(
                            (entry.shotTypes[key] / totalHolesPlayed) * 100
                          )}%`
                        : (entry.shotTypes.putt / totalHolesPlayed).toFixed(2)}
                    </span>
                  </CustomTag>
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
                  // legends={[
                  //   {
                  //     anchor: 'bottom',
                  //     direction: 'row',
                  //     justify: false,
                  //     translateX: 0,
                  //     translateY: 56,
                  //     itemsSpacing: 0,
                  //     itemWidth: 50,
                  //     itemHeight: 18,
                  //     itemTextColor: '#999',
                  //     itemDirection: 'bottom-to-top',
                  //     itemOpacity: 1,
                  //     symbolSize: 18,
                  //     symbolShape: 'circle',
                  //   },
                  // ]}
                />
              </span>
            </Card>
          );
        })}
      </Root>
    </ErrorBoundary>
  );
};
