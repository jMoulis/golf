import { Timestamp } from "firebase/firestore";

export type CourseType = {
  id: string,
  name: string
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
}

export type GamePayloadType = {
  courseRef: string;
  date: Timestamp
}

export type GameType = {
  _id: string;
  courseRef: string;
  date: Date
}