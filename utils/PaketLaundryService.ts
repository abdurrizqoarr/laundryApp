import axios from "axios";

const prefix = "laundry-packets";

async function getAll() {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}`;
    const response = await axios.get(baseUrl);
    return response.data.data; // Akses langsung response.data
  } catch (error) {
    throw error;
  }
}

async function getDetail(id: string) {
  try {
    const baseUrl = `http://192.168.1.11/laundry/public/api/${prefix}/${id}`;
    const response = await axios.get(baseUrl);
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

export default {
  getAll,
  getDetail,
};
