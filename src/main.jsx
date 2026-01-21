import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuthStore } from "./store/useAuthStore";
import GlobalLoader from "./components/GlobalLoader";
import ToastContainer from "./components/ToastContainer";

// Restore session before render
useAuthStore.getState().loadFromStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* Global Systems */}
    <GlobalLoader />
    <ToastContainer />
  </StrictMode>,
);
