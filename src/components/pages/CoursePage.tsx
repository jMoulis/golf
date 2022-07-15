import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import { useState } from 'react';
import { useToggle } from '../../hooks/useToggle';
import { theme } from '../../style/theme';
import { CourseForm } from '../Admin/Course/CourseForm';
import { CourseListItem } from '../Admin/Course/CourseListItem';
import { useCourse } from '../Admin/Course/useCourse';
import { ButtonPill } from '../commons/ButtonPill';
import { FixedBottomToolbar } from '../commons/FixedBottomToolbar';
import { List } from '../commons/List';
import { SwipeMenuHeader } from '../commons/SwipeMenuHeader';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { CourseType } from '../types';

const CustomList = styled(List)<{ styling?: any }>`
  max-height: 100%;
  overflow: auto;
  padding-bottom: ${BOTTOM_NAVBAR_HEIGHT};
  ${({ styling }) => styling};
`;

export const CoursePage = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const { courses, onSave, onDelete } = useCourse();
  const { open, onClose, onOpen } = useToggle();

  const handleSelect = (course: CourseType) => {
    onOpen();
    setSelectedCourse(course);
  };

  const handleDelete = (courseId?: string) => {
    if (courseId) {
      onDelete(courseId);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    onOpen();
  };

  const handleSave = (course: CourseType) => {
    console.log(course);
    setSelectedCourse(null);
    onSave(course);
    onClose();
  };

  return (
    <>
      <CustomList>
        {courses.map((course, key) => (
          <CourseListItem
            onDelete={handleDelete}
            onSelect={handleSelect}
            course={course}
            key={key}
          />
        ))}
      </CustomList>
      <SwipeableDrawer
        anchor='bottom'
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onClose={onClose}
        onOpen={() => {}}
        open={open}>
        <SwipeMenuHeader
          title={selectedCourse ? 'Modifier parcours' : 'Nouveau parcours'}
        />
        <CourseForm
          onClose={onClose}
          onSubmit={handleSave}
          selectedCourse={selectedCourse}
        />
      </SwipeableDrawer>
      <FixedBottomToolbar>
        <ButtonPill onClick={handleCreateCourse}>
          AJOUTER UN PARCOURS
        </ButtonPill>
      </FixedBottomToolbar>
    </>
  );
};
