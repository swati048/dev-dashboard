import { Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg font-bold text-white">
          DevDashboard
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="text-gray-300 hover:text-white text-sm px-3 py-2"
          >
            Features
          </button>

          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>

          <Button onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              <button
                onClick={() =>
                  document.getElementById("features")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="text-center text-gray-300 hover:text-white py-2"
              >
                Features
              </button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => go("/login")}
              >
                Login
              </Button>

              <Button
                className="w-full"
                onClick={() => go("/signup")}
              >
                Sign Up
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
