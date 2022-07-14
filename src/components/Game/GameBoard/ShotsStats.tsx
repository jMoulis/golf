import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { theme } from '../../../style/theme';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { shotTypesByTypes } from '../ScoreCard/ShotForm/shotTypes';
import { Stat, Tag } from './stylesComponents';

const CustomTag = styled(Tag)`
  background-color: #fff;
  font-size: 30px;
  box-shadow: ${theme.shadows.flatButton};
`;
type Props = {
  holes?: Record<string, GameHoleType>;
};

export const ShotsStats = ({ holes }: Props) => {
  const [stats, setStats] = useState<{
    regul: number;
    fairway: number;
    putt: number;
    bunker: number;
    penalty: number;
  }>({
    regul: 0,
    fairway: 0,
    putt: 0,
    bunker: 0,
    penalty: 0,
  });
  useEffect(() => {
    if (!holes) {
      setStats({
        regul: 0,
        fairway: 0,
        putt: 0,
        bunker: 0,
        penalty: 0,
      });
    } else {
      const parsedHoles = Object.values(holes);

      const regul = parsedHoles.reduce((acc: number, value) => {
        if (
          value.par === value.shots?.length &&
          value.shots?.filter((shot) => shot.type === 'putt')?.length === 2
        ) {
          return (acc += 1);
        }
        return acc;
      }, 0);

      const fairway = parsedHoles.reduce((acc: number, value) => {
        if (!value.shots) return acc;
        const [shot, nextShot] = value.shots;
        if (shot?.type === 'tee' && nextShot?.type === 'fairway')
          return (acc += 1);
        return acc;
      }, 0);

      const putt: any = parsedHoles.reduce((acc: number, hole) => {
        return (
          acc + (hole.shots?.filter((shot) => shot.type === 'putt').length || 0)
        );
      }, 0);
      const bunker: any = parsedHoles.reduce((acc: number, hole) => {
        return (
          acc +
          (hole.shots?.filter((shot) => shot.type === 'bunker').length || 0)
        );
      }, 0);
      const penalty: any = parsedHoles.reduce((acc: number, hole) => {
        return (
          acc +
          (hole.shots?.filter((shot) => shot.type === 'penalty').length || 0)
        );
      }, 0);

      setStats({
        regul,
        fairway,
        putt,
        bunker,
        penalty,
      });
    }
  }, [holes]);

  return (
    <Flexbox
      flex='1'
      justifyContent='space-around'
      styling={{
        marginBottom: '7px',
      }}>
      {Object.keys(stats).map((key) => (
        <Stat key={key}>
          <CustomTag
            scoreColor={{
              bk: '',
              color: shotTypesByTypes[key]?.color,
            }}>
            {shotTypesByTypes[key]?.icon}
          </CustomTag>
          <span>{(stats as any)[key]}</span>
        </Stat>
      ))}
    </Flexbox>
  );
};
