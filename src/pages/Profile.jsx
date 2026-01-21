import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, Edit2, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useLoadingStore } from "../store/useLoadingStore";
import { Input, Button, Card } from "../components/ui";
import { toast } from "../utils/toast";

// Avatar options using DiceBear API
const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "pixel-art",
  "thumbs",
];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
  });

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.bio && form.bio.length > 200) {
      newErrors.bio = "Bio must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      showLoading();
      
      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));

      updateUser(form);
      setIsEditing(false);
      toast.success("Profile updated successfully! 🎉");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const selectAvatar = (style) => {
    const seed = form.email || user?.email || "default";
    const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    setForm({ ...form, avatar: newAvatar });
    setShowAvatarPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
          <p className="text-muted text-sm mt-1">
            Manage your account information
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit Profile
          </Button>
        )}
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-surface border-app">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-app shadow-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute bottom-0 right-0 bg-accent hover:bg-accent-hover text-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary">
                  {user?.name || "Unnamed User"}
                </h3>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>

              {/* Avatar Picker */}
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute mt-2 bg-surface-elevated border border-app rounded-lg p-4 shadow-xl z-10 w-72"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-primary">
                      Choose Avatar Style
                    </h4>
                    <button
                      onClick={() => setShowAvatarPicker(false)}
                      className="text-muted hover:text-primary transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => selectAvatar(style)}
                        className="w-14 h-14 rounded-lg border border-app hover:border-accent transition-all overflow-hidden"
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/${style}/svg?seed=${form.email}`}
                          alt={style}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 space-y-4">
              {/* Name Field */}
              <div className="relative">
                <User
                  className="absolute left-3 top-[38px] text-muted pointer-events-none z-10"
                  size={20}
                />
                <Input
                  id="name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!isEditing}
                  className="[&_input]:pl-11"
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-[38px] text-muted pointer-events-none z-10"
                  size={20}
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!isEditing}
                  className="[&_input]:pl-11"
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm text-secondary mb-2">
                  Bio {form.bio && `(${form.bio.length}/200)`}
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-app text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-55 disabled:cursor-not-allowed resize-none"
                />
                {errors.bio && (
                  <p className="text-xs text-danger mt-1">{errors.bio}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 pt-2"
                >
                  <Button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-surface border-app">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-surface-elevated rounded-lg">
              <p className="text-2xl font-bold text-accent">12</p>
              <p className="text-xs text-muted mt-1">Projects</p>
            </div>
            <div className="text-center p-4 bg-surface-elevated rounded-lg">
              <p className="text-2xl font-bold text-green-500">48</p>
              <p className="text-xs text-muted mt-1">Tasks Completed</p>
            </div>
            <div className="text-center p-4 bg-surface-elevated rounded-lg">
              <p className="text-2xl font-bold text-purple-500">23</p>
              <p className="text-xs text-muted mt-1">Notes</p>
            </div>
            <div className="text-center p-4 bg-surface-elevated rounded-lg">
              <p className="text-2xl font-bold text-yellow-500">7d</p>
              <p className="text-xs text-muted mt-1">Member Since</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}