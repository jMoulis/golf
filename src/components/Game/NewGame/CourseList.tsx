import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import { List, ListItem } from '../../commons/List';
import { CourseType } from '../../types';
import { theme } from '../../../style/theme';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ButtonPill } from '../../commons/ButtonPill';

const CustomList = styled(List)`
  padding-bottom: 80px;
`;
type Props = {
  courses: CourseType[];
  selectedCourse?: CourseType | null;
  onSelect: (course: CourseType | null) => void;
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
      anchor='bottom'
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onClose={onClose}
      onOpen={() => {}}
      open={open}>
      <SwipeMenuHeader title='Parcours' />
      <CustomList>
        {courses?.map((course, key) => (
          <ListItem
            style={{
              minHeight: '60px',
            }}
            selected={course.id === selectedCourse?.id}
            key={key}
            onClick={() =>
              course.id === selectedCourse?.id
                ? onSelect(null)
                : onSelect(course)
            }>
            {course.name}
          </ListItem>
        ))}
      </CustomList>
      <FixedBottomToolbar>
        <ButtonPill onClick={onClose}>Selectionner</ButtonPill>
      </FixedBottomToolbar>
    </SwipeableDrawer>
  );
};
