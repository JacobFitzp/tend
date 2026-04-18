export interface TaskLink {
  url: string;
  label: string;
}

export interface Subtask {
  id: number;
  title: string;
  done: boolean;
}

export interface Task {
  id: number;
  title: string;
  type: string;
  done: boolean;
  important: boolean;
  subtasks: Subtask[];
  link: TaskLink | null;
}

export type TasksMap = Record<string, Task[]>;

export interface TaskType {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg?: string;
  border?: string;
}

export interface StreakState {
  count: number;
  lastClearedKey: string | null;
}

export type Theme = "light" | "dark" | "system";

export interface AppState {
  tasks: TasksMap;
  xp: number;
  accent: string;
  types: TaskType[];
  streak: StreakState;
  celebrated: Record<string, boolean>;
  ooo: Record<string, boolean>;
  workdays: number[];
}

export interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}
