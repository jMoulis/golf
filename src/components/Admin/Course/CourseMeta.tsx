import styled from '@emotion/styled';
import React from 'react';
import { getCountHoles, getCoursePar } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { CourseType } from '../../types';

const CourseName = styled.span`
  font-size: 20px;
  font-weight: 700;
`;
type Props = {
  course: CourseType;
};

export const CourseMeta = ({ course }: Props) => {
  return (
    <Flexbox flexDirection='column'>
      <CourseName>{course.name}</CourseName>
      <span>TROUS: {getCountHoles(course.holes)}</span>
      <span>PAR: {getCoursePar(course.holes)}</span>
    </Flexbox>
  );
};
