import { create } from "zustand";

// Generate last 7 days data
const generateWeekData = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    // Generate random tasks completed (for demo)
    const tasks = Math.floor(Math.random() * 10) + 4;
    
    data.push({
      day: dayName,
      date: date.toISOString().split("T")[0],
      tasks,
    });
  }

  return data;
};

export const useProductivityStore = create((set) => ({
  weeklyData: generateWeekData(),

  // Update today's productivity
  updateTodayProductivity: (tasksCompleted) =>
    set((state) => {
      const newData = [...state.weeklyData];
      newData[6].tasks = tasksCompleted; // Update last day (today)
      return { weeklyData: newData };
    }),

  // Refresh weekly data (call this when needed)
  refreshWeeklyData: () =>
    set({
      weeklyData: generateWeekData(),
    }),
}));