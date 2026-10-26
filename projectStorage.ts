import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROJECTS_KEY = '@smart_home_projects';
export const TASKS_KEY = '@smart_home_tasks_by_project';

export type Project = {
  id: string;
  name: string;
  area: number;
  rooms: number;
  location: string;
  budget?: number;
  spent?: number;
  createdAt?: string;
};

export type FinishingTask = {
  id: string;
  projectId: string;
  title: string;
  deadline: string;
  completed: boolean;
};

export async function loadProjects(): Promise<Project[]> {
  const raw = await AsyncStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveProjects(
  projects: Project[]
): Promise<void> {
  await AsyncStorage.setItem(
    PROJECTS_KEY,
    JSON.stringify(projects)
  );
}

export async function loadTasks(): Promise<
  Record<string, FinishingTask[]>
> {
  const raw = await AsyncStorage.getItem(TASKS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveTasks(
  tasks: Record<string, FinishingTask[]>
): Promise<void> {
  await AsyncStorage.setItem(
    TASKS_KEY,
    JSON.stringify(tasks)
  );
}