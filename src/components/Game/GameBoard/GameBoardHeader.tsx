import styled from '@emotion/styled';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { TotalScores } from './TotalScoresPars';
import { CourseStats } from './CourseStats';
import { ShotsStats } from './ShotsStats';
import { EvalStats } from './EvalStats';
import { useMemo, useState } from 'react';
import { TabType } from '../../commons/TabNavigation/types';
import { TabNavigation } from '../../commons/TabNavigation/TabNavigation';
import { theme } from '../../../style/theme';

const CourseName = styled.span``;

type Props = {
  holes?: Record<string, GameHoleType>;
  courseName: string;
};

export const GameBoardHeader = ({ holes, courseName }: Props) => {
  const tabs: TabType[] = useMemo(() => {
    return [
      {
        label: 'Scores',
        color: theme.colors.gamePlay,
      },
      {
        label: 'Shots',
        color: theme.colors.gamePlay,
      },
      {
        label: 'Eval',
        color: theme.colors.gamePlay,
      },
    ];
  }, []);

  const [selectedTab, setSelectedTab] = useState<TabType | null>(tabs[0]);

  return (
    <>
      <Flexbox
        flexDirection='column'
        styling={{
          padding: '5px',
        }}>
        <CourseName>{courseName}</CourseName>
        <CourseStats holes={holes} />
      </Flexbox>
      <TabNavigation
        selectedTab={selectedTab}
        tabs={tabs}
        onSelectTab={setSelectedTab}>
        {selectedTab?.label === 'Scores' ? <TotalScores holes={holes} /> : null}
        {selectedTab?.label === 'Shots' ? <ShotsStats holes={holes} /> : null}
        {selectedTab?.label === 'Eval' ? <EvalStats holes={holes} /> : null}
      </TabNavigation>
    </>
  );
};
