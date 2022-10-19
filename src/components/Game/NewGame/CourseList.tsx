import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import React from 'react';
import { List, ListItem } from '../../commons/List';
import { CoursePayloadType } from '../../types';
import { theme } from '../../../style/theme';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { CourseMeta } from '../../Admin/Course/CourseMeta';

const CustomList = styled(List)``;
type Props = {
  courses: CoursePayloadType[];
  selectedCourse?: CoursePayloadType | null;
  onSelect: (course: CoursePayloadType) => void;
  open: boolean;
  onClose: () => void;
};

export const CourseList = ({
  courses,
  selectedCourse,
  onSelect,
  open,
  onClose,
}: Props) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onClose={onClose}
      onOpen={() => {}}
      open={open}
    >
      <SwipeMenuHeader title="Parcours" />
      <CustomList>
        {courses?.map((course, key) => (
          <ListItem
            style={{
              minHeight: '60px',
            }}
            selected={course.id === selectedCourse?.id}
            key={key}
            onClick={() => onSelect(course)}
          >
            <CourseMeta course={course} />
          </ListItem>
        ))}
      </CustomList>
    </SwipeableDrawer>
  );
};
