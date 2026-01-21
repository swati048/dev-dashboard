import { create } from "zustand";

export const useNotesStore = create((set) => ({
  notes: [
    {
      id: "1",
      title: "Project Ideas",
      content: "Brainstorming session for Q1 projects",
      category: "ideas",
      createdAt: new Date("2026-01-11T10:00:00").toISOString(),
      updatedAt: new Date("2026-01-11T10:00:00").toISOString(),
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "Discussion points from team standup",
      category: "meeting",
      createdAt: new Date("2026-01-11T09:00:00").toISOString(),
      updatedAt: new Date("2026-01-11T09:00:00").toISOString(),
    },
    {
      id: "3",
      title: "Code Snippets",
      content: "Useful React hooks and patterns",
      category: "code",
      createdAt: new Date("2026-01-10T15:00:00").toISOString(),
      updatedAt: new Date("2026-01-11T08:00:00").toISOString(),
    },
  ],

  // Add new note
  addNote: (note) =>
    set((state) => ({
      notes: [
        {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.notes,
      ],
    })),

  // Update note
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      ),
    })),

  // Delete note
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),

  // Get notes count
  getNotesCount: () => (state) => state.notes.length,

  // Get recent notes
  getRecentNotes: (limit = 5) => (state) =>
    state.notes
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit),
}));