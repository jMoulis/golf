import { Timestamp } from "firebase/firestore";
import { UploadTask } from "firebase/storage";

export type DocumentType = {
  path: string;
  name: string;
  mimeType: string;
  extension: string;
  thumbnail?: string;
}
interface Session {
  id: string;
  topic: string;
  users: string[];
  userId: string;
  tasks?: TaskType[];
  documents?: DocumentType[];
}

export interface SessionType extends Session {
  date: Date;
}

export interface SessionPayload extends Session {
  date: Timestamp
}

export type TaskType = {
  id: string;
  text: string;
  status: boolean;
}

export type LoadingType = 'UNSET' | 'LOADING' | 'DONE' | 'UNAUTHORIZED' | 'CANCELED' | 'UNKNOWN' | 'PAUSE' | 'ERROR';

export type AddFileType = {
  fullPath: string;
  file: File;
  name: string;
};

export type UploadTaskWithID = { task: UploadTask, id: number, loading: LoadingType, progress: number }

export type VideoType = { blob: Blob; thumbnail: string, name: string };