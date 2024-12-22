import { create } from 'zustand';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3002/api';

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) {
        throw new Error('プロジェクトの取得に失敗しました');
      }
      const projects = await response.json();
      set({ projects, loading: false, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました', loading: false });
    }
  },

  addProject: async (project) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          start_date: project.startDate,
          end_date: project.endDate,
        }),
      });
      if (!response.ok) {
        throw new Error('プロジェクトの作成に失敗しました');
      }
      const newProject = await response.json();
      set((state) => ({
        projects: [...state.projects, newProject],
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました', loading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          start_date: updates.startDate,
          end_date: updates.endDate,
        }),
      });
      if (!response.ok) {
        throw new Error('プロジェクトの更新に失敗しました');
      }
      const updatedProject = await response.json();
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? updatedProject : project
        ),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました', loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('プロジェクトの削除に失敗しました');
      }
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました', loading: false });
    }
  },
}));
