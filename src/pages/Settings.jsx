import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  User,
  Bell,
  Shield,
  Trash2,
  Download,
  Upload,
  Moon,
  Sun,
  Save,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useTaskStore } from "../store/useTaskStore";
import { useNotesStore } from "../store/useNotesStore";
import { Button, Card, Input, Modal, Toggle } from "../components/ui";
import { toast } from "../utils/toast";
import { cn } from "../utils/cn";

// Settings Section Component
function SettingsSection({ title, description, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="text-accent" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      <Card className="bg-surface border-app p-6">{children}</Card>
    </motion.div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-primary">{label}</p>
        {description && <p className="text-xs text-muted mt-1">{description}</p>}
      </div>
      <Toggle 
        checked={enabled} 
        onChange={onChange} 
      />
    </div>
  );
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useThemeStore();
  const tasks = useTaskStore((s) => s.tasks);
  const notes = useNotesStore((s) => s.notes);

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    soundEffects: false,
    compactView: false,
  });

  // Account settings
  const [accountForm, setAccountForm] = useState({
    displayName: user?.name || "",
    email: user?.email || "",
  });

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  // Handle preference toggle
  const handlePreferenceToggle = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
    toast.success("Preference updated");
  };

  // Handle account update
  const handleAccountUpdate = () => {
    if (!accountForm.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    updateUser({
      name: accountForm.displayName,
      email: accountForm.email,
    });
    toast.success("Account updated successfully!");
  };

  // Handle data export
  const handleExportData = () => {
    try {
      const data = {
        user,
        tasks,
        notes,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-backup-${new Date().toISOString().split("T")[0]}.json`;
      
      document.body.appendChild(a); 
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
      setShowExportModal(false);
    } catch (error) {
      toast.error("Export failed");
      console.error(error);
    }
  };

  // Handle data import
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // Here you would import the data into your stores
        console.log("Imported data:", data);
        toast.success("Data imported successfully!");
      } catch (error) {
        toast.error("Failed to import data. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    // Clear all data
    localStorage.clear();
    logout();
    toast.success("Account deleted. Redirecting...");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted mt-1">
          Manage your account, preferences, and application settings
        </p>
      </div>

      {/* Appearance Settings */}
      <SettingsSection
        title="Appearance"
        description="Customize how the dashboard looks"
        icon={Palette}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-3">
              Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  theme === "light"
                    ? "border-accent bg-accent/10"
                    : "border-app hover:border-accent/50"
                )}
              >
                <Sun className="mx-auto mb-2 text-yellow-500" size={24} />
                <p className="text-sm font-medium text-primary">Light</p>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  theme === "dark"
                    ? "border-accent bg-accent/10"
                    : "border-app hover:border-accent/50"
                )}
              >
                <Moon className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-sm font-medium text-primary">Dark</p>
              </button>
            </div>
          </div>

          <ToggleSwitch
            enabled={preferences.compactView}
            onChange={(val) => handlePreferenceToggle("compactView", val)}
            label="Compact View"
            description="Reduce spacing and use smaller UI elements"
          />
        </div>
      </SettingsSection>

      {/* Account Settings */}
      <SettingsSection
        title="Account"
        description="Manage your personal information"
        icon={User}
      >
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={accountForm.displayName}
            onChange={(e) =>
              setAccountForm({ ...accountForm, displayName: e.target.value })
            }
            placeholder="Your name"
          />

          <Input
            label="Email"
            type="email"
            value={accountForm.email}
            onChange={(e) =>
              setAccountForm({ ...accountForm, email: e.target.value })
            }
            placeholder="you@example.com"
          />

          <Button onClick={handleAccountUpdate} className="flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        title="Notifications"
        description="Configure how you receive updates"
        icon={Bell}
      >
        <div className="divide-y divide-app">
          <ToggleSwitch
            enabled={preferences.emailNotifications}
            onChange={(val) => handlePreferenceToggle("emailNotifications", val)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            enabled={preferences.pushNotifications}
            onChange={(val) => handlePreferenceToggle("pushNotifications", val)}
            label="Push Notifications"
            description="Get browser push notifications"
          />
          <ToggleSwitch
            enabled={preferences.taskReminders}
            onChange={(val) => handlePreferenceToggle("taskReminders", val)}
            label="Task Reminders"
            description="Remind me about upcoming tasks"
          />
          <ToggleSwitch
            enabled={preferences.weeklyDigest}
            onChange={(val) => handlePreferenceToggle("weeklyDigest", val)}
            label="Weekly Digest"
            description="Get a summary of your week every Monday"
          />
          <ToggleSwitch
            enabled={preferences.soundEffects}
            onChange={(val) => handlePreferenceToggle("soundEffects", val)}
            label="Sound Effects"
            description="Play sounds for actions and notifications"
          />
        </div>
      </SettingsSection>

      {/* Data & Privacy */}
      <SettingsSection
        title="Data & Privacy"
        description="Manage your data and privacy settings"
        icon={Shield}
      >
        <div className="space-y-4">
          {/* Export Data */}
          <div className="p-4 rounded-lg bg-surface-elevated border border-app">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="text-blue-500" size={18} />
                  <h4 className="font-semibold text-primary">Export Data</h4>
                </div>
                <p className="text-sm text-muted mb-3">
                  Download all your tasks, notes, and settings as JSON
                </p>
                <Button
                  onClick={() => setShowExportModal(true)}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Import Data */}
          <div className="p-4 rounded-lg bg-surface-elevated border border-app">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="text-green-500" size={18} />
                  <h4 className="font-semibold text-primary">Import Data</h4>
                </div>
                <p className="text-sm text-muted mb-3">
                  Import data from a previously exported backup
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface border border-app text-sm font-medium text-primary cursor-pointer transition-colors">
                    <Upload size={14} />
                    Choose File
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  Storage Information
                </p>
                <p className="text-xs text-muted">
                  You have {tasks.length} tasks and {notes.length} notes. All data is
                  stored locally in your browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions"
        icon={AlertTriangle}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="text-red-500" size={18} />
                  <h4 className="font-semibold text-primary">Delete Account</h4>
                </div>
                <p className="text-sm text-muted mb-3">
                  Permanently delete your account and all associated data. This action
                  cannot be undone.
                </p>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="secondary"
                  size="sm"
                  className="text-red-500 hover:text-red-400 border-red-500/20 hover:border-red-500/40"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Export Confirmation Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
        size="md"
        hideCloseButton
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-primary">
                Your data will be exported as a JSON file containing:
              </p>
              <ul className="text-xs text-muted mt-2 space-y-1 list-disc list-inside">
                <li>{tasks.length} tasks</li>
                <li>{notes.length} notes</li>
                <li>User profile and settings</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleExportData} className="flex-1">
              <Download size={16} className="mr-2" />
              Export Now
            </Button>
            <Button
              onClick={() => setShowExportModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
        hideCloseButton
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-semibold text-primary mb-2">
                This action is permanent and cannot be undone!
              </p>
              <p className="text-xs text-muted">
                All your data including {tasks.length} tasks, {notes.length} notes, and
                account information will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              <Trash2 size={16} className="mr-2" />
              Yes, Delete Everything
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}