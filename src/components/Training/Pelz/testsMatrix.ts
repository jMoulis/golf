import { ENUM_PELZ_THEME } from "./enums";
import { isBetween } from "./utils";

export const buildArrayFromNumber = (length: number) =>
  Array.from({ length }, (_, index) => (index += 1));


const singleTestMatrix: {
  [key: string]: [number, number, string][]
} = {
  'TEST 1': [[0, 2, '25+'], [2, 4, '25-15'], [4, 6, '15-8'], [6, 8, '8-3'], [8, 9, '3-0'], [9, 41, 'Tour']],
  'TEST 2': [[0, 3, '27+'], [3, 5, '27-17'], [5, 8, '17-8'], [8, 10, '8-5'], [10, 12, '5-0'], [12, 41, 'Tour']],
  'TEST 3': [[0, 2, '22+'], [2, 5, '22-12'], [5, 7, '12-6'], [7, 10, '6-2'], [10, 12, '2-0'], [12, 41, 'Tour']],
  'TEST 4': [[0, 2, '16+'], [2, 5, '16-6'], [5, 7, '6-3'], [7, 9, '3-1'], [9, 11, '1-0'], [11, 41, 'Tour']],
  'TEST 5': [[0, 6, '30+'], [6, 9, '30-22'], [9, 11, '22-12'], [11, 14, '12-5'], [14, 16, '5-0'], [16, 41, 'Tour']],
  'TEST 6': [[0, 6, '30+'], [6, 9, '30-22'], [9, 11, '22-12'], [11, 14, '12-5'], [14, 16, '5-0'], [16, 41, 'Tour']],
  'TEST 7': [[0, 3, '33+'], [3, 5, '33-20'], [5, 7, '20-12'], [7, 9, '12-7'], [9, 14, '7-0'], [14, 41, 'Tour']],
  'TEST 8': [[0, 3, '30+'], [3, 6, '30-17'], [6, 8, '17-10'], [8, 10, '10-5'], [10, 13, '5-0'], [13, 41, 'Tour']],
}

export const globalTestMatrix: {
  [key: string]: [number, number, number][]
} = {
  [ENUM_PELZ_THEME.SHORT_GAME]: [[150, 145, -8], [145, 140, -7], [140, 135, -6], [135, 130, -5], [130, 125, -3], [125, 120, -2], [120, 115, -1], [115, 110, 0], [110, 107, 1], [107, 103, 2], [103, 100, 3], [100, 97, 4], [97, 93, 5], [93, 90, 6], [90, 87, 7], [87, 83, 8], [83, 80, 9], [80, 77, 10], [77, 73, 11], [73, 70, 12], [70, 67, 13], [67, 63, 14], [63, 60, 15], [60, 58, 16], [58, 56, 17], [56, 54, 18], [54, 52, 19], [52, 50, 20], [50, 48, 21], [48, 46, 22], [46, 44, 23], [44, 42, 24], [42, 40, 35], [40, 38, 26], [38, 36, 27], [36, 34, 28], [34, 32, 29], [32, 30, 30], [30, 28, 31], [28, 26, 32], [26, 24, 33], [24, 22, 34], [22, 20, 35], [20, 18, 36], [18, 16, 37], [16, 14, 38], [14, 12, 39]],
  [ENUM_PELZ_THEME.PUTTING]: []
};

const ranges: Record<string, [number, number, string][]> = buildArrayFromNumber(8).reduce((acc: Record<string, [number, number, string][]>, id: number) => {
  const testID = `TEST ${id}`;
  return {
    ...acc,
    [testID]: singleTestMatrix[testID] || []
  }
}, {});


export const pelzMatrices = (testID: string, score: number) => {
  const getRanges = ranges[testID];
  return (getRanges || []).reduce((acc: string, [low, high, value]) => {
    if (isBetween(low, high, score)) {
      return value;
    }
    return acc;
  }, '');

};