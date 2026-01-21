import { IconButton } from "../components/ui";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  BarChart2,
  ListChecks,
  StickyNote,
  User,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { path: "/app", icon: <HomeIcon size={20} />, label: "Dashboard" },
    { path: "/app/kanban", icon: <ListChecks size={20} />, label: "Kanban" },
    { path: "/app/analytics", icon: <BarChart2 size={20} />, label: "Analytics" },
    { path: "/app/notes", icon: <StickyNote size={20} />, label: "Notes" },
    { path: "/app/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/app/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="
      h-screen 
      w-[55px] 
      bg-[#1e1e1e] 
      border-r 
      border-[#3c3c3c] 
      flex 
      flex-col 
      items-center 
      py-4
    ">
      {items.map((item) => {
        const active = item.path === "/app" 
          ? pathname === "/app" 
          : pathname.startsWith(item.path);

        return (
          <IconButton
            key={item.path}
            title={item.label}
            onClick={() => navigate(item.path)}
            className={`
              w-10 h-10 mb-3 
              flex items-center justify-center 
              rounded-md
              ${
                active
                  ? "bg-[#0078d4] text-white"
                  : "text-gray-400 hover:bg-white/10"
              }
            `}
          >
            {item.icon}
          </IconButton>
        );
      })}
    </aside>
  );
}
