import { GameHoleType, HoleCourseType } from "../components/types";

export const scoresConfig = {
  pars: { bk: "green", color: "#fff", label: "Par" },
  birdies: { bk: "#0000e5", color: "#fff", label: "Birdie" },
  eagles: { bk: "#ff8c19", color: "#fff", label: "Eagle" },
  boggeys: { bk: "#a8a8a8", color: "#000", label: "Boggey" },
  double: { bk: "#6F6F6F", color: "#fff", label: "Double Boggey" },
  triple: { bk: "#323232", color: "#fff", label: "Triple boggey +" },
};

export const scoreResult = (par: number, score: number) => {
  // No score
  if (score === 0) return { bk: "", color: "#000", label: "" };
  // All in one
  if (score === 1) return { bk: "red", color: "#fff", label: "All in one" };
  // Par
  if (par === score) return scoresConfig.pars;
  if (score === par - 3) return scoresConfig.eagles;
  // Eagle
  if (score === par - 2) return scoresConfig.eagles;
  // Birdie
  if (score === par - 1) return scoresConfig.birdies;
  // Boggey
  if (score === par + 1) return scoresConfig.boggeys;
  // DoubleBoggey
  if (score === par + 2) return scoresConfig.double;
  // More
  if (score > par + 2) return scoresConfig.triple;
  return { bk: "", color: "#000" };
};

export const getCoursePar = (holes?: (HoleCourseType | GameHoleType)[]) => {
  if (!holes) return 0;
  return holes.reduce((acc: any, hole: any) => acc + (hole.par || 0), 0);
};
export const getScoreBrut = (holes?: GameHoleType[]) => {
  if (!holes) return 0;
  return holes.reduce(
    (acc: any, hole: any) => acc + (hole.shots?.length || 0),
    0
  );
};
export const getDiff = (holes?: (GameHoleType)[]) => {
  const activeHoles = holes?.filter((hole) => hole.shots?.length);
  if (!activeHoles) return 0;
  return getScoreBrut(activeHoles) - getCoursePar(activeHoles);
};

export const getCountHoles = (holes?: (HoleCourseType | GameHoleType)[]) => {
  if (!holes) return 0;
  return holes.length;
};

export const getHolesScores = (holes?: GameHoleType[]) => {
  if (!holes)
    return {
      eagles: 0,
      birdies: 0,
      pars: 0,
      boggeys: 0,
      double: 0,
      triple: 0,
    };
  const pars = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.par === hole.shots?.length ? (acc += 1) : acc,
    0
  );
  const birdies = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.par - 1 === hole.shots?.length ? (acc += 1) : acc,
    0
  );
  const eagles = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.shots?.length && hole.shots?.length <= hole.par - 2
        ? (acc += 1)
        : acc,
    0
  );
  const boggeys = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.par + 1 === hole.shots?.length ? (acc += 1) : acc,
    0
  );
  const double = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.par + 2 === hole.shots?.length ? (acc += 1) : acc,
    0
  );
  const triple = holes.reduce(
    (acc: number, hole: GameHoleType) =>
      hole.shots?.length >= hole.par + 3 ? (acc += 1) : acc,
    0
  );
  return {
    eagles,
    birdies,
    pars,
    boggeys,
    double,
    triple,
  };
};

export const scoresByType = (holes?: GameHoleType[]) => {
  if (holes) {
    // Find how many par;
    const pars = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.par === hole.shots?.length ? (acc += 1) : acc,
      0
    );
    const birdies = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.par - 1 === hole.shots?.length ? (acc += 1) : acc,
      0
    );
    const eagles = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.shots?.length && hole.shots?.length <= hole.par - 2
          ? (acc += 1)
          : acc,
      0
    );
    const boggeys = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.par + 1 === hole.shots?.length ? (acc += 1) : acc,
      0
    );
    const double = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.par + 2 === hole.shots?.length ? (acc += 1) : acc,
      0
    );
    const triple = holes.reduce(
      (acc: number, hole: GameHoleType) =>
        hole.shots?.length >= hole.par + 3 ? (acc += 1) : acc,
      0
    );
    return {
      eagles,
      birdies,
      pars,
      boggeys,
      double,
      triple,
    };
  }
  return {
    eagles: 0,
    birdies: 0,
    pars: 0,
    boggeys: 0,
    double: 0,
    triple: 0,
  };
};

export const shotsTypeStat = (holes: GameHoleType[]) => {
  const regul = holes.reduce((acc: number, value) => {
    if (
      value.par === value.shots?.length &&
      value.shots?.filter((shot) => shot.type === 'putt')?.length === 2
    ) {
      return (acc += 1);
    }
    return acc;
  }, 0);

  const fairway = holes.reduce((acc: number, value) => {
    if (!value.shots) return acc;
    const [shot, nextShot] = value.shots;
    if (shot?.type === 'tee' && nextShot?.type === 'fairway')
      return (acc += 1);
    return acc;
  }, 0);

  const putt: any = holes.reduce((acc: number, hole) => {
    return (
      acc + (hole.shots?.filter((shot) => shot.type === 'putt').length || 0)
    );
  }, 0);
  const bunker: any = holes.reduce((acc: number, hole) => {
    return (
      acc +
      (hole.shots?.filter((shot) => shot.type === 'bunker').length || 0)
    );
  }, 0);
  const penalty: any = holes.reduce((acc: number, hole) => {
    return (
      acc +
      (hole.shots?.filter((shot) => shot.type === 'penalty').length || 0)
    );
  }, 0);
  return {
    regul,
    fairway,
    putt,
    bunker,
    penalty,
  }
}