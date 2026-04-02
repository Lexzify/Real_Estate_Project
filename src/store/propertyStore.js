import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const usePropertyStore = create((set) => ({
  properties: [],
  pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
  loading: false,
  error: null,

  fetchProperties: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosClient.get("/properties", { params });
      set({
        properties: data.data,
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch properties",
      });
      return null;
    }
  },
}));

export default usePropertyStore;
