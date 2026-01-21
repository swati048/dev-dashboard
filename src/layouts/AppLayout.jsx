import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorOverlay from "../components/GlobalErrorOverlay";
import CommandPalette from "../components/CommandPalette";
import AppFooter from "../components/AppFooter";

export default function AppLayout() {
  const navigate = useNavigate();

  const commands = [
    { label: "Dashboard", action: () => navigate("/app") },
    { label: "Kanban", action: () => navigate("/app/kanban") },
    { label: "Analytics", action: () => navigate("/app/analytics") },
    { label: "Notes", action: () => navigate("/app/notes") },
    { label: "Profile", action: () => navigate("/app/profile") },
    { label: "Settings", action: () => navigate("/app/settings") },
    {
      label: "Toggle Theme",
      action: () => document.dispatchEvent(new Event("toggle-theme")),
    },
  ];
  
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorOverlay}>
      <div className="bg-app text-app flex flex-col h-screen overflow-hidden">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div 
            className="flex-1 overflow-y-auto flex flex-col" 
            id="main-scroll-container"
          >
            <main className="flex-1 flex flex-col min-h-full">
              <div className="flex-1 mb-6 p-6">
                <Outlet />
              </div>
              <AppFooter />
            </main>
          </div>
        </div>

        <CommandPalette commands={commands} />
      </div>
    </ErrorBoundary>
  );
}

