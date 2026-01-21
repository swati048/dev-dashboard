import { Heart, Github, Linkedin, Mail } from "lucide-react";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-app bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by{" "}
            <span className="text-primary font-medium">ST</span>
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              title="GitHub"
            >
              <Github size={18} />
            </a>
            
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            
            <a
              href="mailto:you@example.com"
              className="text-muted hover:text-accent transition-colors"
              title="Email"
            >
              <Mail size={18} />
            </a>
          </div>

          <p className="text-xs text-muted">© {currentYear} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}