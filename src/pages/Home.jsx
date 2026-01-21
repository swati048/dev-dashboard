import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  LayoutDashboard,
  BarChart2,
  ListChecks,
  StickyNote,
  User,
  Zap
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LayoutDashboard size={26} />,
      title: "Smart Dashboard",
      desc: "Centralized view of your projects, tasks, and productivity in one clean workspace.",
    },
    {
      icon: <ListChecks size={26} />,
      title: "Kanban Workflow",
      desc: "Organize tasks visually with powerful drag-and-drop task boards.",
    },
    {
      icon: <BarChart2 size={26} />,
      title: "Analytics Insights",
      desc: "Understand your work habits and productivity with real-time analytics.",
    },
    {
      icon: <StickyNote size={26} />,
      title: "Notes & Ideas",
      desc: "Capture ideas instantly and manage knowledge inside your workspace.",
    },
    {
      icon: <User size={26} />,
      title: "User Profiles",
      desc: "Fully customizable profiles with preferences, avatars, and settings.",
    },
    {
      icon: <Zap size={26} />,
      title: "Fast & Focused",
      desc: "Keyboard shortcuts, quick commands, and smooth performance everywhere.",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden pt-16 md:pt-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Navbar />
      
      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-16 md:pb-20 text-center relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          className="inline-block mb-4 sm:mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            ✨ Built for Developers
          </span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
          Developer Productivity Dashboard
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
          A modern workspace designed for developers to manage tasks, track productivity, 
          and stay focused without distractions.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
            >
              Log In
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/signup")}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Create Free Account
            </Button>
          </motion.div>
        </div>

        {/* Hero Visual - Floating Cards */}
        <motion.div
          className="mt-12 sm:mt-16 relative max-w-4xl mx-auto h-64 sm:h-80"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Dashboard Preview Card */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-48 sm:h-56 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-blue-500/20 rounded w-full"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-16 bg-white/5 rounded flex-1"></div>
                <div className="h-16 bg-white/5 rounded flex-1"></div>
                <div className="h-16 bg-white/5 rounded flex-1"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating Accent Cards */}
          <motion.div
            className="absolute left-4 sm:left-12 top-8 w-20 sm:w-24 h-20 sm:h-24 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 flex items-center justify-center"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BarChart2 size={28} className="text-blue-400" />
          </motion.div>

          <motion.div
            className="absolute right-4 sm:right-12 top-12 w-20 sm:w-24 h-20 sm:h-24 bg-purple-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 flex items-center justify-center"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ListChecks size={28} className="text-purple-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ===== FEATURES GRID ===== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12 px-4">
          Everything you need in one place
        </h2>

        <motion.div
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="
                p-5 sm:p-6
                rounded-xl sm:rounded-2xl
                border border-white/10 
                bg-white/5 
                backdrop-blur-md 
                hover:border-[#0078d4]/50
                hover:bg-white/10
                hover:shadow-lg hover:shadow-blue-500/10
                transition-all
                cursor-pointer
              "
            >
              <div className="text-[#0078d4] mb-3">
                {f.icon}
              </div>

              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {f.title}
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <motion.section
        className="border-t border-white/10 bg-white/5 backdrop-blur-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">
            Start building better workflows today
          </h2>

          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join developers who want clarity, speed, and focus in their daily work.
            Sign up in seconds and level up your workflow.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")}
              className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      <Footer />
    </motion.div>
  );
}