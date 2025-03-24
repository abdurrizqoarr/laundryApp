import axios from "axios";

const prefix = 'laundry-packets'

async function getAll() {
    try {
        const baseUrl = `http://192.168.1.7/laundry/public/api/${prefix}`;
        const response = await axios.get(baseUrl);
        return response.data.data; // Akses langsung response.data
    } catch (error) {
        throw error;
    }
}

export default {
    getAll,
}