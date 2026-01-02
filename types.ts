
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
}

export interface Quote {
  text: string;
  author: string;
}

export type ThemeColor = 'purple' | 'cyan' | 'emerald' | 'rose' | 'amber';
