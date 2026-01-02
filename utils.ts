
import { Habit } from './types';

export const getTodayString = () => new Date().toISOString().split('T')[0];

export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // If last completion isn't today or yesterday, streak is broken
  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayString) return 0;

  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completedDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getCompletedTodayCount = (habits: Habit[]): number => {
  const today = getTodayString();
  return habits.filter(h => h.completedDates.includes(today)).length;
};
