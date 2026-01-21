import { create } from "zustand";

export const useTaskStore = create((set, get) => ({
  tasks: [
    {
      id: "1",
      title: "Fix login bug",
      description: "Users unable to login with special characters in password",
      status: "todo",
      priority: "high",
      dueDate: "2026-01-12",
      createdAt: new Date("2026-01-10").toISOString(),
    },
    {
      id: "2",
      title: "Design new homepage",
      description: "Create modern landing page with hero section",
      status: "in-progress",
      priority: "medium",
      dueDate: "2026-01-13",
      createdAt: new Date("2026-01-09").toISOString(),
    },
    {
      id: "3",
      title: "Write documentation",
      description: "API documentation for developers",
      status: "todo",
      priority: "low",
      dueDate: "2026-01-14",
      createdAt: new Date("2026-01-08").toISOString(),
    },
    {
      id: "4",
      title: "Code review PR #123",
      description: "Review authentication refactor pull request",
      status: "todo",
      priority: "high",
      dueDate: "2026-01-12",
      createdAt: new Date("2026-01-11").toISOString(),
    },
    {
      id: "5",
      title: "Update dependencies",
      description: "Update npm packages to latest versions",
      status: "done",
      priority: "medium",
      dueDate: "2026-01-11",
      createdAt: new Date("2026-01-07").toISOString(),
      completedAt: new Date("2026-01-10").toISOString(),
    },
  ],

  // Add new task
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  // Update existing task
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              ...(updates.status === "done" && !task.completedAt
                ? { completedAt: new Date().toISOString() }
                : {}),
            }
          : task
      ),
    })),

  // Delete task
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // Get tasks by status
  getTasksByStatus: (status) => {
    const state = get();
    return state.tasks.filter((task) => task.status === status);
  },
  // Get upcoming tasks (not done, sorted by due date)
  getUpcomingTasks: () => {
    const state = get();
    return state.tasks
      .filter((task) => task.status !== "done")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },
  
}));