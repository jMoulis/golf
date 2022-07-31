import styled from '@emotion/styled';
import { getCoursePar, getDiff } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { GameHoleType, GameType, HoleCourseType } from '../../types';

const Stat = styled.span`
  margin-right: 10px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  holes?: (GameHoleType | HoleCourseType)[];
  game: GameType;
};

export const CourseStats = ({ holes, game }: Props) => {
  return (
    <Flexbox>
      <Stat>PAR: {getCoursePar(holes)}</Stat>
      <Stat>BRUT: {game.strokeBrut}</Stat>
      <Stat>DIFF: {getDiff(holes as GameHoleType[])}</Stat>
    </Flexbox>
  );
};
