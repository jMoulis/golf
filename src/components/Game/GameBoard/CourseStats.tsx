import styled from '@emotion/styled';
import { getCoursePar, getDiff, getScoreBrut } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { GameHoleType, HoleCourseType } from '../../types';

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
};

export const CourseStats = ({ holes }: Props) => {
  return (
    <Flexbox>
      <Stat>PAR: {getCoursePar(holes)}</Stat>
      <Stat>BRUT: {getScoreBrut(holes)}</Stat>
      <Stat>DIFF: {getDiff(holes)}</Stat>
    </Flexbox>
  );
};
