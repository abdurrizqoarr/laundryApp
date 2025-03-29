export interface DataOrder {
  id: string;
  customer_id: string;
  packet_id: string;
  total_harga: number;
  total_berat: number;
  status: "pengerjaan" | "selesai" | "batal";
  estimasi_selesai: string;
  customer: {
    alamat: string;
    nama_customer: string;
    nomer_hp: string;
  };
  laundry_packet: {
    harga: number;
    nama_paket: string;
  };
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface DataOrderState {
  order: DataOrder[];
  pagination: Pagination | undefined;
  hasMoreData: boolean;
  isLoading: boolean;
  error: string | null;
  fetchData: (page: number) => Promise<void>;
}
