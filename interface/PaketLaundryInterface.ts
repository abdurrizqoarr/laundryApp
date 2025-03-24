export interface DataPaketLaundry {
  id: string;
  nama_paket: string;
  harga: number;
}

export interface DataPaketLaundryState {
  paketLaundry: DataPaketLaundry[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}
