import { Timestamp } from "firebase/firestore";

export type HoleCourseType = {
  ref?: string;
  number: number,
  par?: number,
  hcp?: number,
  distances?: {
    black?: number, white?: number, yellow: number, blue?: number, red?: number
  }[]
}
export type CourseType = {
  id?: string,
  name: string,
  sss?: {
    men?: any,
    women?: any
  },
  slope?: {
    men?: any,
    women?: any
  }
  holes: HoleCourseType[]
}

export type DistanceType = {
  black?: string;
  white?: string;
  red?: string;
  yellow?: string;
  blue?: string;
}

export type CourseHoleType = {
  par: number;
  hcp: number;
  number: number;
  distances: DistanceType[]
}

export type GameHoleType = {
  ref: string;
  number: number;
  par: number;
  shots: any[]
}

export type GamePayloadType = {
  courseRef: string;
  date: Timestamp;
  holes: Record<string, GameHoleType>;
  themes: ThemeType[];
  userId: string;
}

export type GameType = {
  id: string;
  courseRef: string;
  date: Date;
  holes: Record<string, GameHoleType>
  themes: ThemeType[]
}

export type ThemeType = {
  id: string;
  type: string;
}

export type ThemeTypeInput = {
  type: string;
  userId: string
}

export type UserType = {
  id?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  roles?: string[];
  coaches?: UserType[];
}