export type Priority = 'High' | 'Medium' | 'Low';

export type Category = 'Study' | 'Work' | 'Personal';

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  getStats: () => { pending: number; completed: number; high: number; completionRate: number };
}
