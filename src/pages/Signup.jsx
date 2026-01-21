import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input, Button, Card } from "../components/ui";
import { useAuthStore } from "../store/useAuthStore";
import { useLoadingStore } from "../store/useLoadingStore";
import { toast } from "../utils/toast";

export default function Signup() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const { showLoading, hideLoading } = useLoadingStore();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Invalid email address";
    }

    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!form.confirm) {
      next.confirm = "Please confirm your password";
    } else if (form.password !== form.confirm) {
      next.confirm = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      showLoading();
      await new Promise((res) => setTimeout(res, 800));

      register({
        name: form.name,
        email: form.email,
      });

      toast.success("Account created successfully! 🎉");
      navigate("/app", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back to Home</span>
      </motion.button>

      {/* Signup Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Sign up to get better developer experience
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <User
                  className="absolute left-3 top-[38px] text-gray-400 pointer-events-none z-10"
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
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <Mail
                  className="absolute left-3 top-[38px] text-gray-400 pointer-events-none z-10"
                  size={20}
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[38px] text-gray-400 pointer-events-none z-10"
                  size={20}
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  error={errors.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <CheckCircle2
                  className="absolute left-3 top-[38px] text-gray-400 pointer-events-none z-10"
                  size={20}
                />
                <Input
                  id="confirm"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  error={errors.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Password Strength Indicator */}
            {form.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= 6
                        ? "bg-green-500"
                        : form.password.length >= 4
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= 8 &&
                      /[A-Z]/.test(form.password) &&
                      /[0-9]/.test(form.password)
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= 10 &&
                      /[A-Z]/.test(form.password) &&
                      /[0-9]/.test(form.password) &&
                      /[^A-Za-z0-9]/.test(form.password)
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {form.password.length < 6
                    ? "Weak password"
                    : form.password.length < 8
                    ? "Good password"
                    : "Strong password"}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button type="submit" className="w-full mt-2">
                Create Account
              </Button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.p
            className="text-sm text-gray-400 mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </motion.p>
        </Card>

        {/* Terms Notice */}
        <motion.p
          className="mt-6 text-center text-xs text-gray-500 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </motion.p>
      </motion.div>
    </div>
  );
}