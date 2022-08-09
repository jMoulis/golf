import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { theme } from '../../../style/theme';
import { shotsTypeStat } from '../../../utils/scoreUtils';
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
  holes?: GameHoleType[];
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
      const { regul, fairway, putt, bunker, penalty } = shotsTypeStat(holes);
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
      flex="1"
      justifyContent="space-around"
      styling={{
        marginBottom: '7px',
      }}
    >
      {Object.keys(stats).map((key) => (
        <Stat key={key}>
          <CustomTag
            scoreColor={{
              bk: '',
              color: shotTypesByTypes[key]?.color,
            }}
          >
            {shotTypesByTypes[key]?.icon}
          </CustomTag>
          <span>{(stats as any)[key]}</span>
        </Stat>
      ))}
    </Flexbox>
  );
};
