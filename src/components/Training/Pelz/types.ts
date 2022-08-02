import { Timestamp } from "firebase/firestore";
import { ENUM_PELZ_THEME } from "./enums";

export type PelzTestShot = {
  id: string;
  value: number
}

export type PelzTestType = {
  id: string;
  shots: PelzTestShot[];
  order: number;
}

type Pelz = {
  theme: ENUM_PELZ_THEME;
  tests: Record<string, PelzTestType>;
  userId: string;

}

export interface PelzType extends Pelz {
  id: string;
  date: Date;
}

export interface PelzPayload extends Pelz {
  date: Timestamp;
}

export interface PelzTestInput extends Pelz {
  date: Timestamp;
  userId: string;
}

export type TestDescriptionType = {
  instructions: {
    title: string;
    detail?: string;
  };
  averagePoint?: number;
  scoring: string[];
  image: string;
}
export type TestMapDescriptionType = {
  [key: string]: {
    [key: string]: TestDescriptionType;
  };
}