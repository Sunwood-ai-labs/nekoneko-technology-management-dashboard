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
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      // TODO: バックエンドAPIが実装されたら実際のAPIコールに置き換える
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'ねこねこプロジェクト1',
          status: '進行中',
          progress: 75,
          description: 'テストプロジェクト1の説明',
          startDate: '2024-01-01',
          endDate: '2024-06-30'
        },
        {
          id: '2',
          name: 'ねこねこプロジェクト2',
          status: '計画中',
          progress: 25,
          description: 'テストプロジェクト2の説明',
          startDate: '2024-02-01',
          endDate: '2024-08-31'
        }
      ];
      
      set({ projects: mockProjects, loading: false });
    } catch (error) {
      set({ error: '프로젝트 데이터를 불러오는데 실패했습니다.', loading: false });
    }
  },

  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, project]
    }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id)
    }));
  }
}));
