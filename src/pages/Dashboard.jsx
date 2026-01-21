import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  Circle,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  LayoutGrid,
  Zap,
  Target,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import { useNotesStore } from "../store/useNotesStore";
import { useActivityStore } from "../store/useActivityStore";
import { useProductivityStore } from "../store/useProductivityStore";
import { Button, Card } from "../components/ui";
import { useNavigate } from "react-router-dom";

// Helper function for relative time
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return past.toLocaleDateString();
};

// Activity type to icon/color mapping
const getActivityIcon = (type) => {
  switch (type) {
    case "task_completed":
      return { icon: CheckCircle2, color: "text-green-500" };
    case "note_created":
      return { icon: FileText, color: "text-blue-500" };
    case "task_started":
      return { icon: Circle, color: "text-yellow-500" };
    case "profile_updated":
      return { icon: Target, color: "text-purple-500" };
    default:
      return { icon: Circle, color: "text-gray-500" };
  }
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  // Get data from stores
  const tasks = useTaskStore((s) => s.tasks);
  const getUpcomingTasks = useTaskStore((s) => s.getUpcomingTasks);
  const notes = useNotesStore((s) => s.notes);
  const getRecentActivities = useActivityStore((s) => s.getRecentActivities);
  const weeklyData = useProductivityStore((s) => s.weeklyData);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get upcoming tasks
  const upcomingTasks = getUpcomingTasks().slice(0, 5);

  // Get recent activities
  const recentActivities = getRecentActivities(4);

  // Notes stats
  const notesCount = notes.length;
  const todayNotes = notes.filter((note) => {
    const noteDate = new Date(note.createdAt).toDateString();
    const today = new Date().toDateString();
    return noteDate === today;
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {greeting}, {user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/app/kanban")} variant="secondary" className="flex items-center gap-2">
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">View Board</span>
          </Button>
          <Button onClick={() => navigate("/app/notes")} className="flex items-center gap-2">
            <Plus size={16} />
            New Note
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <Card className="bg-surface border-app hover:border-accent transition-colors cursor-pointer" onClick={() => navigate("/app/kanban")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Total Tasks</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{totalTasks}</h3>
              <p className="text-xs text-muted mt-1">
                {inProgressTasks} in progress, {todoTasks} todo
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="text-blue-500" size={24} />
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card className="bg-surface border-app hover:border-accent transition-colors cursor-pointer" onClick={() => navigate("/app/kanban")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{completedTasks}</h3>
              <p className="text-xs text-green-500 mt-1">
                ✓ {completedTasks} finished
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Target className="text-green-500" size={24} />
            </div>
          </div>
        </Card>

        {/* Productivity */}
        <Card className="bg-surface border-app hover:border-accent transition-colors cursor-pointer" onClick={() => navigate("/app/analytics")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Productivity</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{productivityScore}%</h3>
              <p className="text-xs text-purple-500 mt-1">
                <TrendingUp className="inline" size={12} /> Task completion rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Zap className="text-purple-500" size={24} />
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="bg-surface border-app hover:border-accent transition-colors cursor-pointer" onClick={() => navigate("/app/notes")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Notes</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{notesCount}</h3>
              <p className="text-xs text-muted mt-1">
                {todayNotes} created today
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <FileText className="text-yellow-500" size={24} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Productivity Chart + Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productivity Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-app">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    Weekly Productivity
                  </h3>
                  <p className="text-sm text-muted">Tasks completed per day</p>
                </div>
                <TrendingUp className="text-accent" size={20} />
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyData.map((item, index) => {
                  const maxTasks = Math.max(...weeklyData.map((d) => d.tasks));
                  const height = maxTasks > 0 ? (item.tasks / maxTasks) * 100 : 0;
                  
                  return (
                    <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-accent hover:bg-accent-hover rounded-t-lg transition-colors cursor-pointer relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-elevated px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.tasks} tasks
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-app">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Upcoming Tasks
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/kanban")}
                  className="text-accent hover:text-accent-hover text-sm"
                >
                  View all →
                </Button>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <Circle size={48} className="mx-auto mb-2 opacity-20" />
                  <p>No upcoming tasks</p>
                  <Button
                    onClick={() => navigate("/app/kanban")}
                    className="mt-4"
                    size="sm"
                  >
                    Create your first task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated hover:bg-surface border border-app hover:border-accent transition-all cursor-pointer group"
                      onClick={() => navigate("/app/kanban")}
                    >
                      <div className="flex-shrink-0">
                        <Circle className="text-muted group-hover:text-accent transition-colors" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              task.priority === "high"
                                ? "bg-red-500/20 text-red-500"
                                : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-gray-500/20 text-muted"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions + Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-app">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/app/kanban")}
                  className="p-4 rounded-lg bg-surface-elevated hover:bg-accent/10 border border-app hover:border-accent transition-all group"
                >
                  <Plus className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-sm font-medium text-primary">New Task</p>
                </button>
                <button
                  onClick={() => navigate("/app/notes")}
                  className="p-4 rounded-lg bg-surface-elevated hover:bg-accent/10 border border-app hover:border-accent transition-all group"
                >
                  <FileText className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-sm font-medium text-primary">New Note</p>
                </button>
                <button
                  onClick={() => navigate("/app/analytics")}
                  className="p-4 rounded-lg bg-surface-elevated hover:bg-accent/10 border border-app hover:border-accent transition-all group"
                >
                  <TrendingUp className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-sm font-medium text-primary">Analytics</p>
                </button>
                <button
                  onClick={() => navigate("/app/profile")}
                  className="p-4 rounded-lg bg-surface-elevated hover:bg-accent/10 border border-app hover:border-accent transition-all group"
                >
                  <Target className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-sm font-medium text-primary">Profile</p>
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-app">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Recent Activity
                </h3>
                <Clock className="text-muted" size={18} />
              </div>

              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <Clock size={48} className="mx-auto mb-2 opacity-20" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center ${color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary">
                            <span className="font-medium">{activity.action}</span>
                          </p>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {activity.item}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {getRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}