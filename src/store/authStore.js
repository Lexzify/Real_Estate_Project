import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/login", payload);
          set({ token: data.token, user: data.user, isLoading: false });
          return data;
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/register", payload);
          set({ token: data.token, user: data.user, isLoading: false });
          return data;
        } catch (error) {
          const message = error.response?.data?.message || "Registration failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      fetchMe: async () => {
        try {
          const { data } = await axiosClient.get("/users/me");
          set({ user: data });
          return data;
        } catch {
          set({ token: null, user: null });
          return null;
        }
      },

      updateProfile: async (payload) => {
        const { data } = await axiosClient.put("/users/update", payload);
        set((state) => ({ user: { ...state.user, ...data } }));
        return data;
      },

      logout: () => set({ token: null, user: null, error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
