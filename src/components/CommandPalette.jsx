import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Command,
  Hash,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  User,
  Home,
  StickyNote,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";
import { useNotesStore } from "../store/useNotesStore";

// Icon mapping for command types
const ICONS = {
  navigation: Home,
  task: CheckSquare,
  note: StickyNote,
  page: FileText,
  settings: Settings,
  user: User,
  analytics: BarChart3,
  kanban: Calendar,
};

export default function CommandPalette({ commands = [] }) {
  const navigate = useNavigate();
  const tasks = useTaskStore((s) => s.tasks);
  const notes = useNotesStore((s) => s.notes);
  
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paletteRef = useRef(null);
  const inputRef = useRef(null);

  // Enhanced commands with categories and icons
  const enhancedCommands = [
    // Navigation commands
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      category: "Navigation",
      icon: "navigation",
      keywords: ["home", "dashboard", "overview"],
      action: () => navigate("/app"),
    },
    {
      id: "nav-kanban",
      label: "Go to Kanban Board",
      category: "Navigation",
      icon: "kanban",
      keywords: ["kanban", "board", "tasks"],
      action: () => navigate("/app/kanban"),
    },
    {
      id: "nav-analytics",
      label: "Go to Analytics",
      category: "Navigation",
      icon: "analytics",
      keywords: ["analytics", "stats", "charts", "reports"],
      action: () => navigate("/app/analytics"),
    },
    {
      id: "nav-notes",
      label: "Go to Notes",
      category: "Navigation",
      icon: "note",
      keywords: ["notes", "write", "markdown"],
      action: () => navigate("/app/notes"),
    },
    {
      id: "nav-profile",
      label: "Go to Profile",
      category: "Navigation",
      icon: "user",
      keywords: ["profile", "account", "user"],
      action: () => navigate("/app/profile"),
    },
    {
      id: "nav-settings",
      label: "Go to Settings",
      category: "Navigation",
      icon: "settings",
      keywords: ["settings", "preferences", "config"],
      action: () => navigate("/app/settings"),
    },
    
    // Action commands
    {
      id: "action-new-task",
      label: "Create New Task",
      category: "Actions",
      icon: "task",
      keywords: ["new", "create", "task", "add"],
      action: () => navigate("/app/kanban"),
    },
    {
      id: "action-new-note",
      label: "Create New Note",
      category: "Actions",
      icon: "note",
      keywords: ["new", "create", "note", "write"],
      action: () => navigate("/app/notes"),
    },
    
    // Original commands from props
    ...commands.map((cmd, index) => ({
      id: `custom-${index}`,
      label: cmd.label,
      category: "Other",
      icon: "page",
      keywords: [cmd.label.toLowerCase()],
      action: cmd.action,
    })),
  ];

  // Add recent tasks as searchable items
  const taskCommands = tasks.slice(0, 5).map((task) => ({
    id: `task-${task.id}`,
    label: task.title,
    category: "Recent Tasks",
    icon: "task",
    subtitle: `${task.status} • ${task.priority} priority`,
    keywords: [task.title.toLowerCase(), task.status, task.priority],
    action: () => navigate("/app/kanban"),
  }));

  // Add recent notes as searchable items
  const noteCommands = notes.slice(0, 5).map((note) => ({
    id: `note-${note.id}`,
    label: note.title || "Untitled",
    category: "Recent Notes",
    icon: "note",
    subtitle: note.content.slice(0, 50),
    keywords: [note.title?.toLowerCase() || "", note.content.toLowerCase()],
    action: () => navigate("/app/notes"),
  }));

  const allCommands = [...enhancedCommands, ...taskCommands, ...noteCommands];

  // Filter commands based on search query
  const filtered = allCommands.filter((cmd) => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return true;
    
    return (
      cmd.label.toLowerCase().includes(searchTerm) ||
      cmd.category.toLowerCase().includes(searchTerm) ||
      cmd.keywords?.some((kw) => kw.includes(searchTerm)) ||
      cmd.subtitle?.toLowerCase().includes(searchTerm)
    );
  });

  // Group by category
  const groupedCommands = filtered.reduce((acc, cmd) => {
    const category = cmd.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(cmd);
    return acc;
  }, {});

  // Global keyboard shortcut
  useEffect(() => {
    const listener = (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }

      // Escape closes
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getIcon = (iconName) => {
    const Icon = ICONS[iconName] || FileText;
    return Icon;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 z-[60] px-4"
        >
          <motion.div
            ref={paletteRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#1f1f1f] rounded-xl shadow-2xl border border-[#3c3c3c] overflow-hidden"
          >
            {/* Search Input */}
            <div className="relative border-b border-[#3c3c3c]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={inputRef}
                autoFocus
                className="w-full p-4 pl-12 pr-24 bg-transparent outline-none text-white text-lg placeholder-gray-400"
                placeholder="Search commands, tasks, notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-[#2a2a2a] border border-[#3c3c3c] rounded">
                  <Command size={12} className="inline mr-1" />K
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <Search size={48} className="mx-auto mb-3 text-gray-600 opacity-50" />
                  <p className="text-gray-400">No results found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try searching for tasks, notes, or commands
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      {/* Category Header */}
                      <div className="px-3 py-2 flex items-center gap-2">
                        <Hash size={14} className="text-gray-500" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {category}
                        </span>
                      </div>

                      {/* Commands in Category */}
                      {cmds.map((cmd, index) => {
                        const globalIndex = filtered.indexOf(cmd);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = getIcon(cmd.icon);

                        return (
                          <motion.button
                            key={cmd.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => {
                              cmd.action();
                              setOpen(false);
                              setQuery("");
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                              isSelected
                                ? "bg-blue-500/20 border border-blue-500/50"
                                : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-blue-500/20" : "bg-[#2a2a2a]"
                              }`}
                            >
                              <Icon
                                size={18}
                                className={isSelected ? "text-blue-400" : "text-gray-400"}
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isSelected ? "text-white" : "text-gray-200"
                                }`}
                              >
                                {cmd.label}
                              </p>
                              {cmd.subtitle && (
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                  {cmd.subtitle}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <ArrowRight size={16} className="text-blue-400 flex-shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#3c3c3c] bg-[#1a1a1a] p-3 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-[#2a2a2a] border border-[#3c3c3c] rounded">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-[#2a2a2a] border border-[#3c3c3c] rounded">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-[#2a2a2a] border border-[#3c3c3c] rounded">
                    esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
              <span className="text-gray-500">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}