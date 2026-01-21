import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll the window (for public routes)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", 
    });

    // 2. Target the dashboard's main scroll area (for protected routes) if the window isn't scrolling
    const dashboardContainer = document.getElementById('main-scroll-container');

    if (dashboardContainer) {
      dashboardContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // "instant" ensures the user doesn't see the scroll jump
      });
    }
  }, [pathname]);

  return null;
}