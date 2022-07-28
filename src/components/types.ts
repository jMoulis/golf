import { Timestamp } from "firebase/firestore";

export type HoleCourseType = {
  ref: string;
  number: number;
  par: number;
  hcp: number;
  distances?: {
    black?: number;
    white?: number;
    yellow: number;
    blue?: number;
    red?: number;
  }[];
};
export interface GameHoleType extends HoleCourseType {
  shots: any[];
}
export type CourseType = {
  id?: string;
  name: string;
  par: number;
  countHoles?: number;
  sss?: {
    men?: any;
    women?: any;
  };
  slope?: {
    men?: any;
    women?: any;
  };
  holes: HoleCourseType[];
};

export type DistanceType = {
  black?: string;
  white?: string;
  red?: string;
  yellow?: string;
  blue?: string;
};

export type CourseHoleType = {
  par: number;
  hcp: number;
  number: number;
  distances: DistanceType[];
};

export type GameStatus = "DRAFT" | "DONE";

export enum ENUM_GAME_STATUS {
  DRAFT = "DRAFT",
  DONE = "DONE",
}

interface GameTypeCommons {
  courseRef: string;
  holes: Record<string, GameHoleType>;
  themes: ThemeType[];
  userId: string;
  users: UserType[];
  strokeBrut?: number;
  status?: GameStatus;
  coach?: UserTypeSummary;
  player?: UserTypeSummary;
  scoreCardPDF?: string;
}
export interface GamePayloadType extends GameTypeCommons {
  date: Timestamp;
}

export interface GameType extends GameTypeCommons {
  id: string;
  date: Date;
}

export type ThemeType = {
  id: string;
  type: string;
};

export type ThemeTypeInput = {
  type: string;
  userId: string;
};

export type UserType = {
  id?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  roles?: string[];
  coaches?: UserType[];
  students?: UserType[];
};

export type UserTypeSummary = {
  id?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
};
