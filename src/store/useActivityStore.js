import { create } from "zustand";

export const useActivityStore = create((set, get) => ({
  activities: [
    {
      id: "1",
      action: "Completed task",
      item: "Fix responsive design",
      type: "task_completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      action: "Created note",
      item: "Project ideas brainstorm",
      type: "note_created",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: "3",
      action: "Started task",
      item: "Implement dark mode",
      type: "task_started",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: "4",
      action: "Updated profile",
      item: "Changed avatar",
      type: "profile_updated",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ],

  // Add activity
  addActivity: (activity) =>
    set((state) => ({
      activities: [
        {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
        ...state.activities,
      ].slice(0, 50), // Keep only last 50 activities
    })),

  // Get recent activities
  getRecentActivities: (limit = 5) => {
    const state = get();
    return state.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },
  
}));