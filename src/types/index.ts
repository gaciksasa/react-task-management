// src/types.ts

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, title: string, description: string) => void;
}

export interface FilterButtonsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
}