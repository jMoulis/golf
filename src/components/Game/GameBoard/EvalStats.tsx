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
`;
const CustomShotButton = styled(ShotButton)`
  height: 30px;
  width: 30px;
  font-size: 15px;
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

    const lool: any = new Map();

    themes.forEach((theme) => {
      return Object.keys(theme).forEach((key: string) => {
        const evaluation = theme[key];
        const prev = lool.get(key);
        if (prev) {
          lool.set(key, {
            ...prev,
            [evaluation]: prev[evaluation]
              ? [...prev[evaluation], evaluation]
              : [evaluation],
          });
        } else {
          console.log('here', key);
          lool.set(key, {
            [evaluation]: [evaluation],
          });
        }
      }, {});
    });
    return [...lool];
  }, [holes]);
  console.log(shotQualityAsObject);
  return (
    <Flexbox
      styling={{
        marginBottom: '7px',
        marginLeft: '10px',
      }}>
      {totalScore.map(([key, value]) => (
        <Stat key={key}>
          <CustomTag
            scoreColor={{
              bk: '',
              color: shotTypesByTypes[key]?.color,
            }}>
            {key}
          </CustomTag>
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
        </Stat>
      ))}
    </Flexbox>
  );
};
