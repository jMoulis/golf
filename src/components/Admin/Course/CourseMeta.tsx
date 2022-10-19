import styled from '@emotion/styled';
import React from 'react';
import { Flexbox } from '../../commons';
import { CoursePayloadType, CourseType } from '../../types';

const CourseName = styled.span`
  font-size: 20px;
  font-weight: 700;
`;
type Props = {
  course: CoursePayloadType | CourseType;
};

export const CourseMeta = ({ course }: Props) => {
  return (
    <Flexbox flexDirection="column">
      <CourseName>{course.name}</CourseName>
      <span>TROUS: {course.countHoles}</span>
      <span>PAR: {course.par}</span>
    </Flexbox>
  );
};
