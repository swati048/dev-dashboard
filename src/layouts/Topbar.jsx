import { useRef, useEffect, useState } from "react";
import { IconButton } from "../components/ui";
import { Search, Bell, LogOut, User, Settings, Sun, Moon, X } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "../store/useTaskStore";
import { useNotesStore } from "../store/useNotesStore";
import viteLogo from '/vite.svg'

const getInitial = (user) => {
  if (!user) return "?";
  if (user.name) return user.name.trim()[0].toUpperCase();
  if (user.email) return user.email.trim()[0].toUpperCase();
  return "?";
};

// Mock notifications - you can replace with real data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "task",
    title: "Task Due Soon",
    message: "Fix login bug is due today",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "success",
    title: "Task Completed",
    message: "You completed Update dependencies",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "New Feature",
    message: "Check out the new Analytics page",
    time: "1 day ago",
    unread: false,
  },
];

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const tasks = useTaskStore((s) => s.tasks);
  const notes = useNotesStore((s) => s.notes);
  const navigate = useNavigate();
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const userDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click & escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setUserDropdownOpen(false);
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Search functionality
  const searchResults = searchQuery.trim()
    ? [
        ...tasks
          .filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((task) => ({
            type: "task",
            title: task.title,
            subtitle: `Priority: ${task.priority}`,
            onClick: () => {
              navigate("/app/kanban");
              setSearchOpen(false);
              setSearchQuery("");
            },
          })),
        ...notes
          .filter((note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((note) => ({
            type: "note",
            title: note.title,
            subtitle: note.content.slice(0, 50) + "...",
            onClick: () => {
              navigate("/app/notes");
              setSearchOpen(false);
              setSearchQuery("");
            },
          })),
      ]
    : [];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="w-full h-12 flex items-center justify-between px-4 py-6 border-b border-[#3c3c3c] bg-[#1e1e1e]">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <img 
          src={viteLogo} 
          className="w-6 h-6 object-contain" 
          alt="Vite logo" />
        <span className="font-medium text-lg text-gray-200 tracking-wide">
          Developer Dashboard
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <IconButton
            title="Search (Ctrl + K)"
            className="text-white"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={18} /> 
          </IconButton>

          {/* Search Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                className="absolute right-0 mt-2 w-96 bg-[#1f1f1f] border border-[#3c3c3c] rounded-md shadow-xl z-50"
              >
                {/* Search Input */}
                <div className="p-3 border-b border-[#3c3c3c]">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks and notes..."
                      className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#3c3c3c] rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {searchQuery.trim() === "" ? (
                    <div className="p-8 text-center text-gray-400">
                      <Search size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Type to search tasks and notes</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p className="text-sm">No results found</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={result.onClick}
                          className="w-full text-left p-3 rounded hover:bg-white/10 transition-colors mb-1"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                result.type === "task"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {result.subtitle}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="p-2 border-t border-[#3c3c3c] bg-[#1a1a1a]">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Quick links</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigate("/app/kanban");
                          setSearchOpen(false);
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Kanban
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => {
                          navigate("/app/notes");
                          setSearchOpen(false);
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Notes
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => {
                          navigate("/app/analytics");
                          setSearchOpen(false);
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Analytics
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <div className="relative">
            <IconButton
              title="Notifications"
              className="text-white"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={18} />
            </IconButton>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-[#1f1f1f] border border-[#3c3c3c] rounded-md shadow-xl z-50"
              >
                {/* Header */}
                <div className="p-3 border-b border-[#3c3c3c] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  {notifications.length > 0 && (
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={clearAll}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Bell size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#3c3c3c]">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`w-full text-left p-3 hover:bg-white/5 transition-colors ${
                            notification.unread ? "bg-blue-500/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                notification.unread ? "bg-blue-500" : "bg-gray-600"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle theme button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded text-white hover:bg-gray-700 transition"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* USER AVATAR */}
        {user && (
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userDropdownOpen}
              className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-500 flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
            >
              {getInitial(user)}
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 bg-[#1f1f1f] w-48 border border-[#3c3c3c] rounded-md shadow-lg p-2 z-10"
                >
                  <div className="px-3 py-2 border-b border-[#3c3c3c]">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name || "Unnamed User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/app/profile");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 hover:bg-white/10 text-left text-sm text-gray-200 rounded"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/app/settings");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 hover:bg-white/10 text-left text-sm text-gray-200 rounded"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate("/", { replace: true });
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 hover:bg-white/10 text-left text-sm text-red-400 rounded"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}