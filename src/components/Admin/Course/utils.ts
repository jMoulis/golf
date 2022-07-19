import { GameHoleType, HoleCourseType } from "../../types";

export const sortHoles = (incomingHoles: (HoleCourseType | GameHoleType)[]) => Object.values(incomingHoles).map((hole) => (hole)).sort((a, b) => a.number - b.number);