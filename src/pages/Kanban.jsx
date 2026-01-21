import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  GripVertical,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { useActivityStore } from "../store/useActivityStore";
import { Button, Card, Input, Modal } from "../components/ui";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../utils/toast";

const COLUMNS = [
  { id: "todo", title: "To Do", icon: Circle, color: "text-gray-500" },
  { id: "in-progress", title: "In Progress", icon: Clock, color: "text-yellow-500" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-green-500" },
];

// Task Card Component with Native Drag & Drop
function TaskCard({ task, onEdit, onDelete }) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromStatus", task.status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const isOverdue = task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="group p-1"
    >
      <Card className="bg-surface border-app hover:border-accent transition-all cursor-move p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2 flex-1">
            <GripVertical className="text-muted mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            <h4 className="text-sm font-semibold text-primary line-clamp-2 flex-1">
              {task.title}
            </h4>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 hover:bg-surface-elevated rounded text-muted hover:text-accent transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1 hover:bg-surface-elevated rounded text-muted hover:text-danger transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-danger" : "text-muted"}`}>
            {isOverdue && <AlertCircle size={12} />}
            <Calendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Column Component with Native Drop
function KanbanColumn({ column, tasks, onDrop, onEdit, onDelete }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData("taskId");
    const fromStatus = e.dataTransfer.getData("fromStatus");
    
    if (fromStatus !== column.id) {
      onDrop(taskId, column.id);
    }
  };

  const Icon = column.icon;

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full transition-colors rounded-lg p-4 ${
        isDragOver ? "bg-accent/5 border-2 border-accent border-dashed" : "border-2 border-transparent"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={column.color} size={18} />
          <h3 className="font-semibold text-primary">{column.title}</h3>
          <span className="text-xs text-muted bg-surface-elevated px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-2 pb-8 custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Icon size={48} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Task Form Component
function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate || new Date().toISOString().split("T")[0],
    status: task?.status || "todo",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={errors.title}
        placeholder="What needs to be done?"
      />

      <div>
        <label className="block text-sm text-secondary mb-2">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Add more details..."
          rows={3}
          className="w-full px-3 py-2 rounded-md bg-surface border border-app text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-2">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-surface border border-app text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          error={errors.dueDate}
        />
      </div>

      <div>
        <label className="block text-sm text-secondary mb-2">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full px-3 py-2 rounded-md bg-surface border border-app text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {task ? "Save Changes" : "Create Task"}
        </Button>
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Main Kanban Component
export default function Kanban() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const addActivity = useActivityStore((s) => s.addActivity);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter((task) => task.status === column.id);
    return acc;
  }, {});

  // Handle drag and drop
  const handleDrop = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus });
      
      addActivity({
        action: newStatus === "done" ? "Completed task" : "Moved task",
        item: task.title,
        type: newStatus === "done" ? "task_completed" : "task_started",
      });

      toast.success(`Task moved to ${COLUMNS.find((c) => c.id === newStatus).title}`);
    }
  };

  // Handle save task
  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      toast.success("Task updated!");
      addActivity({
        action: "Updated task",
        item: formData.title,
        type: "task_started",
      });
    } else {
      addTask(formData);
      toast.success("Task created!");
      addActivity({
        action: "Created task",
        item: formData.title,
        type: "task_started",
      });
    }
    setEditingTask(null);
    setIsModalOpen(false);
  };

  // Handle delete task
  const handleDeleteTask = (task) => {
    setDeleteDialog({ open: true, task });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kanban Board</h1>
          <p className="text-muted mt-1">Drag and drop tasks to update their status</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface border border-app text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-lg bg-surface border border-app text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id] || []}
            onDrop={handleDrop}
            onEdit={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, task: null })}
        onConfirm={() => {
          const task = deleteDialog.task;
          if (task) {
            deleteTask(task.id);
            toast.success("Task deleted");
            addActivity({
              action: "Deleted task",
              item: task.title,
              type: "task_started",
            });
            setDeleteDialog({ open: false, task: null });
          } 
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteDialog.task?.title || 'this task'}"?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}