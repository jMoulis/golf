import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../../../style/theme';
import { DeleteButton } from '../../commons/Buttons/DeleteButton';
import { ListItem } from '../../commons/List';
import { CourseType } from '../../types';
import { CourseMeta } from './CourseMeta';

const CustomListItem = styled(ListItem)`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto;
  margin: 0;
  border-radius: 0;
  box-shadow: unset;
  border-bottom: 1px solid ${theme.colors.separator};
`;

type Props = {
  course: CourseType;
  onSelect: (course: CourseType) => void;
  onDelete: (courseID: string) => void;
};

export const CourseListItem = ({ course, onSelect, onDelete }: Props) => {
  return (
    <CustomListItem onClick={() => onSelect(course)}>
      <CourseMeta course={course} />
      <DeleteButton
        onClick={(event) => {
          event.stopPropagation();
          onDelete(course.id as string);
        }}
      />
    </CustomListItem>
  );
};
