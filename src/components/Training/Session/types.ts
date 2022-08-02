export type SessionType = {
  id: string;
  topic: string;
  date: Date;
  users: string[];
  userId: string;
  tasks: TaskType[];
}

export type TaskType = {
  id: string;
  text: string;
  status: boolean;
}