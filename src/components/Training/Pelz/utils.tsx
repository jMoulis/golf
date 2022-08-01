import {
  SHORT_GAME_TEST_1,
  SHORT_GAME_TEST_2,
  SHORT_GAME_TEST_3,
  SHORT_GAME_TEST_4,
  SHORT_GAME_TEST_5,
  SHORT_GAME_TEST_6,
  SHORT_GAME_TEST_7,
  SHORT_GAME_TEST_8,
  PUTTING_TEST_1,
  PUTTING_TEST_2,
  PUTTING_TEST_3,
  PUTTING_TEST_4,
  PUTTING_TEST_5,
  PUTTING_TEST_6,
} from './assets';
import { ENUM_PELZ_THEME } from './enums';
import { globalTestMatrix, pelzMatrices } from './testsMatrix';
import { PelzTestType, PelzTestShot, TestMapDescriptionType } from './types';

export const testDescriptionMap: TestMapDescriptionType = {
  [ENUM_PELZ_THEME.SHORT_GAME]: {
    'TEST 1': {
      instructions: { title: '50 yard wedge shot' },
      averagePoint: 10,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_1,
    },
    'TEST 2': {
      instructions: { title: '30 yard wedge shot' },
      averagePoint: 13,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_2,
    },
    'TEST 3': {
      instructions: { title: '8 yard sand shot (green side bunker)' },
      averagePoint: 14,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_3,
    },
    'TEST 4': {
      instructions: { title: '15 yard sand shot (green side bunker)' },
      averagePoint: 12,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_4,
    },
    'TEST 5': {
      instructions: { title: '10 yard chipping from light fringe' },
      averagePoint: 18,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_5,
    },
    'TEST 6': {
      instructions: { title: '20 yard chip shot from light rough' },
      averagePoint: 18,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_6,
    },
    'TEST 7': {
      instructions: { title: '15 yard short pitch' },
      averagePoint: 16,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_7,
    },
    'TEST 8': {
      instructions: { title: '15 yard cut up/lob to tight pin position' },
      averagePoint: 15,
      scoring: [
        'Shots outside 6 feet: 0',
        'Between 6 - 3 feet: 1pt',
        'Inside 3 feet: 2pts',
        'In the hole: 4pts',
      ],
      image: SHORT_GAME_TEST_8,
    },
  },
  [ENUM_PELZ_THEME.PUTTING]: {
    'TEST 1': {
      instructions: {
        title: '3 feet short Putt',
        detail:
          'Putt one ball from 10 different positions encircling a hole (10 putts from 3ft)',
      },
      scoring: ['Missed putts: 0pt', 'Made putts: 1pt'],
      image: PUTTING_TEST_1,
    },
    'TEST 2': {
      instructions: {
        title: '6 fee short putt',
        detail:
          'Putt one ball from 10 different positions encircling a hole (10 putts from 6ft)',
      },
      scoring: ['Missed putts: 0pt', 'Made putts: 1pt'],
      image: PUTTING_TEST_2,
    },
    'TEST 3': {
      instructions: {
        title: 'Makeable Putt',
        detail:
          'Putt 10 balls in order: 1st: 12ft, 2nd: 15ft, 3rd: 18ft, 4th: 21ft, 5th: 24ft and repeat once',
      },
      scoring: [
        'Safe Zone = 36" 1/2 radius',
        'Putts outside of safe zone: 0pt',
        'Putts inside of safe zone: 1pt',
        'Putts in the hole: 2pts',
      ],
      image: PUTTING_TEST_3,
    },
    'TEST 4': {
      instructions: {
        title: 'Big breaking putts',
        detail:
          ' (minimum 2 ft break) - Put one ball from 5 distances in feet (15, 20, 25, 30, 35) with a L-R break. Putt smae lengths with a R-L break (10 putts total)',
      },
      scoring: [
        'Safe Zone = 36" 1/2 radius',
        'Putts outside of safe zone: 0pt',
        'Putts inside of safe zone: 1pt',
        'Putts in the hole: 2pts',
      ],
      image: PUTTING_TEST_4,
    },
    'TEST 5': {
      instructions: {
        title: 'In-between Putts',
        detail:
          'Putt 10 balls in the following position order: 1st: 30ft, 2nd: 35ft, 3rd: 25ft. Repeat cycle until complete',
      },
      scoring: [
        'Putts outside of 6 feet: 0',
        'Putts between 3 - 6 feet: 1pt',
        'Putts inside of 3 feet: 2pts',
        'Putts in the hole: 4pts',
      ],
      image: PUTTING_TEST_5,
    },
    'TEST 6': {
      instructions: {
        title: 'Lag putts',
        detail:
          'Putt 10 balls in the following position order: 1st: 60ft, 2nd: 40ft, 3rd: 80ft. Repeat cycle until complete',
      },
      scoring: [
        'Safe Zone = 36" 1/2 radius',
        'Putts outside of safe zone: 0pt',
        'Putts inside of safe zone: 1pt',
        'Putts in the hole: 2pts',
      ],
      image: PUTTING_TEST_6,
    },
  },
};

export const buildDefaultTestShots: () => PelzTestShot[] = () => {
  const tests = Array.from({ length: 10 }, (_, index) => (index += 1));
  return tests.map((id) => ({
    id: `S${id}`,
    value: 0,
  }));
};

export const buildDefaultTest: (
  theme: ENUM_PELZ_THEME
) => Record<string, PelzTestType> = (theme) => {
  console.log(theme);
  const tests = Array.from(
    { length: theme === ENUM_PELZ_THEME.SHORT_GAME ? 8 : 6 },
    (_, index) => (index += 1)
  );
  return tests.reduce(
    (acc: Record<string, PelzTestType>, id) => ({
      ...acc,
      [`TEST ${id}`]: {
        id: `TEST ${id}`,
        order: id,
        shots: buildDefaultTestShots(),
      },
    }),
    {}
  );
};

export const isBetween = (low: number, high: number, value: number) =>
  value >= low && value <= high;

export const sortTestsObjects = (tests: Record<string, PelzTestType>) =>
  Object.values(tests)
    .sort((a, b) => a.order - b.order)
    .reduce((acc: Record<string, PelzTestType>, test) => {
      return { ...acc, [test.id]: test };
    }, {});

const themes: {
  [key: string]: (testID: string, score: number) => string;
} = {
  [ENUM_PELZ_THEME.SHORT_GAME]: (testId: string, score: number) =>
    pelzMatrices(ENUM_PELZ_THEME.SHORT_GAME, testId, score),
  [ENUM_PELZ_THEME.PUTTING]: (testId: string, score: number) =>
    pelzMatrices(ENUM_PELZ_THEME.PUTTING, testId, score),
};

export const calculatePelzHCPByTest = (
  testId: string,
  score: number,
  theme: ENUM_PELZ_THEME
) => themes[theme](testId, score) || '';

export const getGlobalHCP = (
  theme: ENUM_PELZ_THEME,
  tests: Record<string, PelzTestType>
) => {
  const totalScore = Object.values(tests).reduce((acc: number, test) => {
    const shotsValue = test.shots.reduce(
      (shotValue: number, shot) => shotValue + shot.value,
      0
    );
    return acc + shotsValue;
  }, 0);
  const t = globalTestMatrix[theme];
  return {
    hcp: t.reduce((acc: number, [high, low, value]) => {
      if (isBetween(low, high, totalScore)) {
        return value;
      }
      // if (totalScore >= 150) {
      //   return +8;
      // }
      // if (totalScore < 12) {
      //   return 39;
      // }
      return acc;
    }, 0),
    total: totalScore,
  };
};

export const scoreMappingColor: {
  [key: string]: string;
} = {
  '0': '#323232',
  '1': '#6f6f6f',
  '2': '#a8a8a8',
  '3': '#0000e5',
  '4': 'green',
};
