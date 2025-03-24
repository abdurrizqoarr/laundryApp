import { create } from "zustand";
import { DataPaketLaundryState } from "../interface/PaketLaundryInterface";
import PaketLaundryService from "../utils/PaketLaundryService";

const BahasaStore = create<DataPaketLaundryState>()((set) => ({
  paketLaundry: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await PaketLaundryService.getAll();
      set({ paketLaundry: response, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", isLoading: false });
    }
  },
}));

export default BahasaStore;
