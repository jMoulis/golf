import { ENUM_PELZ_THEME } from './enums';
import { globalTestMatrix, pelzMatrices } from './testsMatrix';
import { PelzTestType, PelzTestShot } from './types';

const testDescriptionMap: {
  [key: string]: {
    explanation: string;
    averagePoint: number;
  };
} = {
  'TEST 1': {
    explanation: '50 yard wedge shot',
    averagePoint: 10,
  },
  'TEST 2': {
    explanation: '30 yard wedge shot',
    averagePoint: 13,
  },
  'TEST 3': {
    explanation: '8 yard sand shot (green side bunker)',
    averagePoint: 14,
  },
  'TEST 4': {
    explanation: '15 yard sandshot (green side bunker)',
    averagePoint: 12,
  },
  'TEST 5': {
    explanation: '10 yard chipping from light fringe',
    averagePoint: 18,
  },
  'TEST 6': {
    explanation: '20 yard chip shot from light rough',
    averagePoint: 18,
  },
  'TEST 7': {
    explanation: '15 yard short pitch',
    averagePoint: 16,
  },
  'TEST 8': {
    explanation: '15 yard cut up/lob to tight pin position',
    averagePoint: 15,
  },
};
export const buildDefaultTestShots: () => PelzTestShot[] = () => {
  const tests = Array.from({ length: 10 }, (_, index) => (index += 1));
  return tests.map((id) => ({
    id: `S${id}`,
    value: 0,
  }));
};

export const buildDefaultTest: () => Record<string, PelzTestType> = () => {
  const tests = Array.from({ length: 8 }, (_, index) => (index += 1));
  return tests.reduce(
    (acc: Record<string, PelzTestType>, id) => ({
      ...acc,
      [`TEST ${id}`]: {
        id: `TEST ${id}`,
        order: id,
        description: testDescriptionMap[`TEST ${id}`],
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
    pelzMatrices(testId, score),
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
      if (totalScore >= 150) {
        return +8;
      }
      if (totalScore < 12) {
        return 39;
      }
      return acc;
    }, 0),
    total: totalScore,
  };
};
