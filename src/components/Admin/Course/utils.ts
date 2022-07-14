import { HoleCourseType } from "../../types";

export const sortHoles = (incomingHoles: HoleCourseType[]) => Object.values(incomingHoles).map((hole) => (hole)).sort((a, b) => a.number - b.number);