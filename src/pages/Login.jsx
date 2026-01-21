import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLoadingStore } from "../store/useLoadingStore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Input, Button, Card } from "../components/ui";
import { toast } from "../utils/toast";     

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const { showLoading, hideLoading } = useLoadingStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = "Invalid email address";
    }

    if (!password) {
      next.password = "Password is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      showLoading();
      await new Promise((res) => setTimeout(res, 600));

      login({ email, name: email.split("@")[0] }, remember);
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      hideLoading();
    }
  };

  const handleDemoLogin = async () => {
    try {
      showLoading();
      await new Promise((res) => setTimeout(res, 800));

      login(
        {
          email: "demo@devdashboard.app",
          name: "Demo User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser",
        },
        false
      );

      toast.success("Welcome! Exploring as Demo User 🚀");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Demo login error:", error);
      toast.error("Demo login failed");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
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

      {/* Login Card */}
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
            <h2 className="text-3xl font-bold text-white mb-2">Welcome</h2>
            <p className="text-gray-400 text-sm">
              Log in to continue to your dashboard
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
                  value={email}
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
                  placeholder="Enter your password"
                  value={password}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="[&_input]:pl-11"
                />
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="cursor-pointer w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            className="relative my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-gray-400">or</span>
            </div>
          </motion.div>

          {/* Demo Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="button"
              onClick={handleDemoLogin}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Try Demo Account
            </Button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            className="text-sm text-gray-400 mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </motion.p>
        </Card>

        {/* Security Badge */}
        <motion.p
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          🔒 Secure login with end-to-end encryption
        </motion.p>
      </motion.div>
    </div>
  );
}