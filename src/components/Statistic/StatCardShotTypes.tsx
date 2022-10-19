import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from 'components/Game/GameBoard/stylesComponents';
import { useConfig } from 'components/Game/ScoreCard/ShotForm/shotTypes';
import React, { useMemo } from 'react';

const CustomTag = styled(Tag)`
  height: 3rem;
  width: 3rem;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
`;

type Props = {
  shotKey: string;
  entry: any;
  totalHolesPlayed: any;
};

export const StatCardShotTypes = ({
  shotKey,
  entry,
  totalHolesPlayed,
}: Props) => {
  const { shotTypesByTypes } = useConfig();

  const shotTypeResult = useMemo(() => {
    if (entry.shotTypes[shotKey])
      return shotKey !== 'putt'
        ? `${Math.floor((entry.shotTypes[shotKey] / totalHolesPlayed) * 100)}%`
        : (entry.shotTypes.putt / totalHolesPlayed).toFixed(2);
    return 'N/A';
  }, [entry.shotTypes, shotKey, totalHolesPlayed]);

  return (
    <CustomTag scoreColor={shotTypesByTypes?.[shotKey] as any} key={shotKey}>
      {shotTypesByTypes?.[shotKey]?.icon ? (
        <FontAwesomeIcon icon={shotTypesByTypes?.[shotKey]?.icon} />
      ) : null}

      <span>{shotTypeResult}</span>
    </CustomTag>
  );
};
