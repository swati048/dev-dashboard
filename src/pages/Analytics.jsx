import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTaskStore } from "../store/useTaskStore";
import { useNotesStore } from "../store/useNotesStore";
import { useProductivityStore } from "../store/useProductivityStore";
import { Card } from "../components/ui";
import { cn } from "../utils/cn";

const COLORS = {
  todo: "#6b7280",
  "in-progress": "#eab308",
  done: "#10b981",
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-surface border-app p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted flex items-center gap-1">
                {trend && (
                  <span className={cn("flex items-center gap-1", trend.positive ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={12} className={trend.positive ? "" : "rotate-180"} />
                    {trend.value}
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", `bg-${color}-500/10`)}>
            <Icon className={`text-${color}-500`} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Custom Tooltip for Charts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-surface border border-app rounded-lg p-3 shadow-xl">
      <p className="text-sm font-semibold text-primary mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-secondary">
            {entry.name}: <span className="font-semibold text-primary">{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);
  const notes = useNotesStore((s) => s.notes);
  const weeklyData = useProductivityStore((s) => s.weeklyData);
  const [timeRange, setTimeRange] = useState("week"); // week, month, all

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Overdue tasks
    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && new Date(t.dueDate) < new Date()
    ).length;

    // Average completion time (mock for now)
    const avgCompletionDays = 3.5;

    // This week vs last week
    const thisWeekCompleted = 12; // Mock
    const lastWeekCompleted = 8;
    const weeklyGrowth = Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      overdueTasks,
      avgCompletionDays,
      totalNotes: notes.length,
      weeklyGrowth,
    };
  }, [tasks, notes]);

  // Tasks by status for pie chart
  const tasksByStatus = useMemo(() => [
    { name: "To Do", value: stats.todoTasks, color: COLORS.todo },
    { name: "In Progress", value: stats.inProgressTasks, color: COLORS["in-progress"] },
    { name: "Done", value: stats.completedTasks, color: COLORS.done },
  ], [stats]);

  // Tasks by priority for bar chart
  const tasksByPriority = useMemo(() => {
    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;

    return [
      { priority: "High", count: high, color: COLORS.high },
      { priority: "Medium", count: medium, color: COLORS.medium },
      { priority: "Low", count: low, color: COLORS.low },
    ];
  }, [tasks]);

  // Completion trend (last 7 days)
  const completionTrend = useMemo(() => {
    return weeklyData.map((day) => ({
      day: day.day,
      completed: day.tasks,
      target: 10, // Mock target
    }));
  }, [weeklyData]);

  // Task completion by category (mock data based on notes categories)
  const tasksByCategory = useMemo(() => {
    const categories = ["Ideas", "Meetings", "Code", "Personal"];
    return categories.map((cat) => ({
      category: cat,
      completed: Math.floor(Math.random() * 15) + 5,
      pending: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics</h1>
          <p className="text-muted mt-1">
            Track your productivity and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                timeRange === range
                  ? "bg-accent text-white"
                  : "bg-surface-elevated text-muted hover:text-primary border border-app"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle={`${stats.completedTasks} completed`}
          icon={Target}
          color="blue"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="of all tasks"
          icon={CheckCircle2}
          color="green"
          trend={{ positive: stats.weeklyGrowth > 0, value: `${Math.abs(stats.weeklyGrowth)}%` }}
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          subtitle="need attention"
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Total Notes"
          value={stats.totalNotes}
          subtitle="created"
          icon={Activity}
          color="purple"
        />
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Trend Line Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-surface border-app p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Completion Trend
                </h3>
                <p className="text-sm text-muted">Tasks completed over time</p>
              </div>
              <BarChart3 className="text-accent" size={20} />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="day"
                  stroke="#7c879b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#8996aa" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#6b7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Tasks by Status Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-surface border-app p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Task Distribution
                </h3>
                <p className="text-sm text-muted">Tasks by status</p>
              </div>
              <PieChartIcon className="text-accent" size={20} />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by Priority Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-surface border-app p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Priority Distribution
                </h3>
                <p className="text-sm text-muted">Tasks by priority level</p>
              </div>
              <Target className="text-accent" size={20} />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="priority"
                  stroke="#7f8ea7"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#838d9e" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0078d4" radius={[8, 8, 0, 0]} name="Tasks">
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Tasks by Category Stacked Bar */}
        <motion.div variants={itemVariants}>
          <Card className="bg-surface border-app p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Category Performance
                </h3>
                <p className="text-sm text-muted">Completed vs pending by category</p>
              </div>
              <Activity className="text-accent" size={20} />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="category"
                  stroke="#8291aa"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#eab308" radius={[8, 8, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-surface border-app p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Key Insights
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-surface-elevated border border-app">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-blue-500" size={20} />
                <h4 className="font-semibold text-primary">Avg. Completion Time</h4>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">
                {stats.avgCompletionDays} days
              </p>
              <p className="text-xs text-muted">Per task average</p>
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated border border-app">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-green-500" size={20} />
                <h4 className="font-semibold text-primary">Most Productive Day</h4>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">Thursday</p>
              <p className="text-xs text-muted">Based on completion rate</p>
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated border border-app">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-purple-500" size={20} />
                <h4 className="font-semibold text-primary">Weekly Growth</h4>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">
                {stats.weeklyGrowth > 0 ? "+" : ""}{stats.weeklyGrowth}%
              </p>
              <p className="text-xs text-muted">Compared to last week</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
