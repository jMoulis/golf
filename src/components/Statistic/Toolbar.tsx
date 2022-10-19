import styled from '@emotion/styled';
import { faGolfClub, faListNumeric } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from 'components/commons/TabNavigation/Tab';
import React from 'react';
import { theme } from 'style/theme';
import { ENUM_TAB_STAT } from './enums';

const Root = styled.div`
  display: flex;
  margin-top: 15px;
  flex: 1;
  justify-content: space-around;
`;

type Props = {
  onSelect: (tabID: ENUM_TAB_STAT) => void;
  selectedTab: ENUM_TAB_STAT | null;
};

export const Toolbar = ({ onSelect, selectedTab }: Props) => {
  return (
    <Root>
      <Tab
        selected={selectedTab === ENUM_TAB_STAT.SCORE}
        onClick={() => onSelect(ENUM_TAB_STAT.SCORE)}
        color={theme.headers.statistics.primary}
      >
        <FontAwesomeIcon icon={faListNumeric} />
        <span>Scores</span>
      </Tab>
      <Tab
        selected={selectedTab === ENUM_TAB_STAT.CLUB}
        onClick={() => onSelect(ENUM_TAB_STAT.CLUB)}
        color={theme.headers.statistics.primary}
      >
        <FontAwesomeIcon icon={faGolfClub} />
        <span>Clubs</span>
      </Tab>
    </Root>
  );
};
