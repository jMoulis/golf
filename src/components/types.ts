import { Timestamp } from "firebase/firestore";

export type SSSSlopeType = {
  sss: number,
  slope: number,
}

export type StartCourseType = {
  start: string;
  mens: SSSSlopeType,
  ladies: SSSSlopeType
}

export type CourseDistanceType = Record<string, number>;

export type HoleCourseType = {
  ref: string;
  number: number;
  par: number;
  hcp: number;
  distances?: CourseDistanceType;
};
export interface GameHoleType extends HoleCourseType {
  shots: ShotType[];
}
export type CourseType = {
  id?: string;
  name: string;
  par: number;
  countHoles?: number;
  starts: Record<string, StartCourseType>;
  holes: HoleCourseType[];
};

export type CoursePayloadType = {
  id?: string;
  name: string;
  par: number;
  countHoles?: number;
  holes: Record<string, HoleCourseType>;
  starts?: Record<string, StartCourseType>;
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
  users: string[];
  strokeBrut?: number;
  status?: GameStatus;
  coach?: UserTypeSummary;
  player?: UserTypeSummary;
  scoreCardPDF?: string;
  start: string;
}
export interface GamePayloadType extends GameTypeCommons {
  date: Timestamp;
}

export interface GameType extends GameTypeCommons {
  id: string;
  date: Date;
}

export type ShotType = {
  type: string;
  distance?: number;
  direction?: string;
  slope?: string
  themes?: any;
  id?: any;
  club?: {
    id: string,
    name: string,
    distance?: number
  }
  coords?: {
    lng: number | null,
    lat: number | null
  }
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  bag?: BagType
};

export type UserTypeSummary = {
  id?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
};

export type ClubType = {
  id: string;
  name: string;
  distance?: number;
  order: number
}
export type BagClubType = {
  id: string;
  name: string;
  distances: number[];
  distance: number;
  order: number
}

export type BagType = BagClubType[];