import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Register - Fixed to accept object
  register: (userData) => {
    const user = {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      bio: userData.bio || "",
    };
    
    set({ user, isAuthenticated: true });

    // Persist by default after signup
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user,
        isAuthenticated: true,
      })
    );
  },

  // Login
  login: (user, remember = false) => {
    // Ensure avatar exists
    const userData = {
      ...user,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      bio: user.bio || "",
    };

    set({ user: userData, isAuthenticated: true });

    if (remember) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: userData, isAuthenticated: true })
      );
    }
  },

  // Logout
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("auth");
  },

  // Restore session if saved
  loadFromStorage: () => {
    const stored = localStorage.getItem("auth");
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      if (data.isAuthenticated) {
        set({ user: data.user, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Failed to parse auth data:", e);
      localStorage.removeItem("auth");
    }
  },

  // Updating profile fields
  updateUser: (updated) => {
    set((state) => {
      const newUser = { ...state.user, ...updated };

      // Always persist to localStorage when updating
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: newUser,
          isAuthenticated: true,
        })
      );

      return { user: newUser };
    });
  },
}));