import { GameHoleType, HoleCourseType, StartCourseType } from '../../types';

export const sortHoles = (incomingHoles: (HoleCourseType | GameHoleType)[]) =>
  Object.values(incomingHoles)
    .map((hole) => hole)
    .sort((a, b) => a.number - b.number);

export const defaultStarts = [
  'black',
  'white',
  'yellow',
  'blue',
  'red',
  'purple',
  'orange',
];

export const orderStarts = (starts: Record<string, StartCourseType>) => {
  return defaultStarts.reduce((acc: Record<string, StartCourseType>, start) => {
    if (!(starts || {})[start]) return acc;
    return {
      ...acc,
      [start]: starts[start],
    };
  }, {});
  // return starts.sort((a, b) => defaultStarts.indexOf(a) - defaultStarts.indexOf(b));
};
