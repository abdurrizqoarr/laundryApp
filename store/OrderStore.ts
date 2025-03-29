import { create } from "zustand";
import { DataOrderState } from "../interface/OrderInterface";
import OrderService from "../utils/OrderService";

const BahasaStore = create<DataOrderState>()((set) => ({
  order: [],
  pagination: undefined,
  isLoading: false,
  hasMoreData: true,
  error: null,
  fetchData: async (page: number = 1) => {
    set({ isLoading: true, error: null });

    try {
      const response = await OrderService.getAll(page);

      if (response.data.length > 0) {
        set((state) => ({
          order:
            page === 1 ? response.data : [...state.order, ...response.data],
          hasMoreData: true,
          isLoading: false,
          pagination: response.pagination,
        }));
      } else {
        set((state) => ({
          hasMoreData: false,
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", isLoading: false });
    }
  },
}));

export default BahasaStore;
