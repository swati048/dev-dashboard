import { createBrowserRouter, Outlet } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import RequireAuth from "./router/RequireAuth";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Analytics from "./pages/Analytics";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Root wrapper with scroll restoration
function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      // 404 catch-all
      { path: "*", element: <NotFound /> },

      // Protected App Routes
      {
        path: "/app",
        element: (
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "kanban", element: <Kanban /> },
          { path: "analytics", element: <Analytics /> },
          { path: "notes", element: <Notes /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);