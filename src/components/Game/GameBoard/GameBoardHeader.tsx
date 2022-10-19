import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown19,
  faGolfBallTee,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { Flexbox } from '../../commons';
import { GameHoleType, GameType } from '../../types';
import { TotalScores } from './TotalScoresPars';
import { CourseStats } from './CourseStats';
import { ShotsStats } from './ShotsStats';
import { EvalStats } from './EvalStats';
import { TabType } from '../../commons/TabNavigation/types';
import { TabNavigation } from '../../commons/TabNavigation/TabNavigation';
import { theme } from '../../../style/theme';
import { Slider } from '../../commons/Slider/Slider';

const CourseName = styled.span``;

type Props = {
  holes?: Record<string, GameHoleType>;
  courseName: string;
  game: GameType;
};

export const GameBoardHeader = ({ holes, courseName, game }: Props) => {
  const tabs: TabType[] = useMemo(() => {
    return [
      {
        label: 'Scores',
        color: theme.colors.gamePlay,
        icon: <FontAwesomeIcon icon={faArrowDown19} />,
        Component: <TotalScores holes={holes} />,
      },
      {
        label: 'Shots',
        color: theme.colors.gamePlay,
        icon: <FontAwesomeIcon icon={faGolfBallTee} />,
        Component: <ShotsStats holes={holes ? Object.values(holes) : []} />,
      },
      {
        label: 'Eval',
        color: theme.colors.gamePlay,
        icon: <FontAwesomeIcon icon={faThumbsUp} />,
        Component: <EvalStats holes={holes} />,
      },
    ];
  }, [holes]);

  const [selectedTab, setSelectedTab] = useState<TabType | null>(tabs[0]);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleSelectTab = (tab: TabType, index: number) => {
    setSelectedTab(tab);
    setTabIndex(index);
  };

  return (
    <>
      <Flexbox
        flexDirection="column"
        styling={{
          padding: '5px',
        }}
      >
        <CourseName>{courseName}</CourseName>
        <CourseStats game={game} holes={holes ? Object.values(holes) : []} />
      </Flexbox>
      <TabNavigation
        selectedTab={selectedTab}
        tabs={tabs}
        onSelectTab={handleSelectTab}
      >
        <Slider
          width={360}
          currentIndex={tabIndex}
          items={tabs.map((tab) => tab.Component)}
        />
      </TabNavigation>
    </>
  );
};
