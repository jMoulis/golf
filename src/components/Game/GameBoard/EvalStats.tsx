import styled from '@emotion/styled';
import { useMemo } from 'react';
import { Flexbox } from '../../commons';
import { ShotButton } from '../../commons/ShotButton';
import { GameHoleType } from '../../types';
import { shotQualityAsObject } from '../ScoreCard/ShotForm/shotQuality';
import { shotTypesByTypes } from '../ScoreCard/ShotForm/shotTypes';
import { Stat, Tag } from './stylesComponents';

const CustomTag = styled(Tag)`
  font-size: 15px;
  margin: 0;
  padding: 0;
  height: fit-content;
  width: fit-content;
`;
const CustomShotButton = styled(ShotButton)`
  height: 40px;
  width: 40px;
  font-size: 20px;
  border-radius: 5px;
`;

type Props = {
  holes?: Record<string, GameHoleType>;
};

export const EvalStats = ({ holes }: Props) => {
  const totalScore = useMemo(() => {
    if (!holes) return [];
    const themes = Object.values(holes)
      .reduce(
        (acc: any[], hole) =>
          hole.shots ? [...acc, hole.shots.map((shot) => shot.themes)] : acc,
        [],
      )
      .flat();

    const stats: any = new Map();

    themes.forEach((theme) => {
      if (!theme) return null;
      return Object.keys(theme).forEach((key: string) => {
        const evaluation = theme[key];
        const prev = stats.get(key);
        if (prev) {
          stats.set(key, {
            ...prev,
            [evaluation]: prev[evaluation]
              ? [...prev[evaluation], evaluation]
              : [evaluation],
          });
        } else {
          stats.set(key, {
            [evaluation]: [evaluation],
          });
        }
      }, {});
    });
    return [...stats];
  }, [holes]);

  return (
    <Flexbox
      flex='1'
      styling={{
        marginBottom: '7px',
        marginLeft: '10px',
        overflow: 'auto',
      }}>
      {totalScore.map(([key, value]) => (
        <Stat key={key}>
          <Flexbox>
            <CustomShotButton
              type='button'
              color={shotQualityAsObject.OK?.color}
              backgroundColor={'#fff'}>
              {shotQualityAsObject.OK?.icon}
              {value.OK?.length}
            </CustomShotButton>
            <CustomShotButton
              type='button'
              color={shotQualityAsObject.KO?.color}
              backgroundColor={'#fff'}>
              {shotQualityAsObject.KO?.icon}
              {value.KO?.length}
            </CustomShotButton>
          </Flexbox>
          <CustomTag
            scoreColor={{
              bk: '',
              color: shotTypesByTypes[key]?.color,
            }}>
            {key}
          </CustomTag>
        </Stat>
      ))}
    </Flexbox>
  );
};
