import { CollapseCard } from '../../commons/CollapseCard';
import { List, ListItem } from '../../commons/List';
import { CourseType } from '../../types';

type Props = {
  courses: CourseType[];
  selectedCourse?: CourseType | null;
  onSelect: (course: CourseType) => void;
};

export const CourseList = ({ courses, selectedCourse, onSelect }: Props) => {
  return (
    <>
      <CollapseCard title='Courses' onAdd={() => {}}>
        <List>
          {courses?.map((course, key) => (
            <ListItem
              selected={course.id === selectedCourse?.id}
              key={key}
              onClick={() => onSelect(course)}>
              {course.name}
            </ListItem>
          ))}
        </List>
      </CollapseCard>
    </>
  );
};
