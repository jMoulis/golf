import styled from '@emotion/styled';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { TotalScores } from './TotalScoresPars';
import { CourseStats } from './CourseStats';
import { ShotsStats } from './ShotsStats';

const CourseName = styled.span``;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 7px -2px rgba(0, 0, 0, 0.25);
  z-index: 3;
`;

type Props = {
  holes?: Record<string, GameHoleType>;
  courseName: string;
};

export const GameBoardHeader = ({ holes, courseName }: Props) => {
  return (
    <Header style={{ display: 'flex' }}>
      <Flexbox
        flexDirection='column'
        styling={{
          padding: '5px',
        }}>
        <CourseName>{courseName}</CourseName>
        <CourseStats holes={holes} />
      </Flexbox>
      <TotalScores holes={holes} />
      <ShotsStats holes={holes} />
    </Header>
  );
};
