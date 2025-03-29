import axios from "axios";
const prefix = "order";

async function sendData(data: {
  packet_id: string;
  nama_customer: string;
  nomer_hp: string;
  alamat: string;
  estimasi_selesai: string;
}) {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}`;
    const response = await axios.post(baseUrl, data);
    return response.data.data; // Akses langsung response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Menangani error dari Axios dengan lebih spesifik
      throw new Error(error.response?.data?.message || "Gagal mengambil data");
    } else {
      // Menangani error lain yang mungkin terjadi
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
}

async function getAll(page: number = 1) {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}?page=${page}`;
    const response = await axios.get(baseUrl);
    return { data: response.data.data, pagination: response.data.pagination }; // Akses langsung response.data
  } catch (error) {
    throw error;
  }
}

async function getDetail(id: string) {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}/${id}`;
    const response = await axios.get(baseUrl);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gagal mengambil data");
    } else {
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
}

async function updateStatus(id: string, status: "selesai" | "batal") {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}/${id}`;
    const response = await axios.put(baseUrl, { status: status });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gagal mengupdate data");
    } else {
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
}

export default {
  sendData,
  getAll,
  getDetail,
  updateStatus,
};
