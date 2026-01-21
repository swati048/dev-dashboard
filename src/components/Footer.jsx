import { Github, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer
      className="
        border-t border-white/10
        bg-black/40 backdrop-blur-md
        text-gray-400
        sm:py-8 px-4 sm:px-6
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              DevDashboard
            </h3>
            <p className="text-sm max-w-sm leading-relaxed">
              A modern productivity dashboard built for developers to manage
              work, focus better, and stay organized.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() =>
                    document.getElementById("features")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="hover:text-white transition"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-white transition"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/signup")}
                  className="hover:text-white transition"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-medium mb-3">Social</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-white/10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DevDashboard. All rights reserved.</p>
          <p className="text-gray-500">Built with React + TailwindCSS</p>
        </div>

      </div>
    </footer>
  );
}
