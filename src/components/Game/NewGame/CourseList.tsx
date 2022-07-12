import styled from '@emotion/styled';
import { List, ListItem } from '../../commons/List';
import { CourseType } from '../../types';

const CustomList = styled(List)`
  padding-bottom: 80px;
`;
type Props = {
  courses: CourseType[];
  selectedCourse?: CourseType | null;
  onSelect: (course: CourseType) => void;
};

export const CourseList = ({ courses, selectedCourse, onSelect }: Props) => {
  return (
    <>
      <CustomList>
        {[
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
          ...courses,
        ]?.map((course, key) => (
          <ListItem
            style={{
              minHeight: '60px',
            }}
            selected={course.id === selectedCourse?.id}
            key={key}
            onClick={() => onSelect(course)}>
            {course.name}
          </ListItem>
        ))}
      </CustomList>
    </>
  );
};
