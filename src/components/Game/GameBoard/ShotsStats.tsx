import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { theme } from '../../../style/theme';
import { shotsTypeStat } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { useConfig } from '../ScoreCard/ShotForm/shotTypes';
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
  const { shotTypesByTypes, shotTypes } = useConfig();
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    if (shotTypes.length) {
      if (!holes) {
        setStats({
          regul: 0,
          fairway: 0,
          ...Object.fromEntries(
            shotTypes
              .filter((shot) => shot.toStat)
              .sort((a, b) => a.order - b.order)
              .map((shot) => [shot.type, 0])
          ),
        });
      } else {
        const shotsStats = shotsTypeStat(holes, shotTypes);
        setStats(shotsStats);
      }
    }
  }, [holes, shotTypes]);

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
            {shotTypesByTypes[key]?.icon ? (
              <FontAwesomeIcon icon={shotTypesByTypes[key]?.icon} />
            ) : null}
          </CustomTag>
          <span>{(stats as any)[key]}</span>
        </Stat>
      ))}
    </Flexbox>
  );
};
