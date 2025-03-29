import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import PaketLaundryService from "@/utils/PaketLaundryService";
import { DataPaketLaundry } from "@/interface/PaketLaundryInterface";
import OrderService from "../../utils/OrderService";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DetailPaketScreen = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<DataPaketLaundry>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [estimasiSelesai, setEstimasiSelesai] = useState<Date | null>(null);
  const [totalBerat, setTotalBerat] = useState<string>("");
  const [namaCustomer, setNamaCustomer] = useState<string>("");
  const [nomerKontak, setNomerKontak] = useState<string>("");
  const [alamatCustomer, setAlamatCustomer] = useState<string>("");
  const router = useRouter();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setEstimasiSelesai(date);
    hideDatePicker();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Array.isArray(id)) {
        return;
      }

      setLoading(true);
      setError("");
      try {
        setLoading(true);
        const response = await PaketLaundryService.getDetail(id);
        setData(response);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Pastikan err memiliki .message
        } else {
          setError("Terjadi kesalahan yang tidak diketahui"); // Fallback jika err bukan instance Error
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSimpanData = async () => {
    if (id && !Array.isArray(id) && estimasiSelesai) {
      const dataPost = {
        packet_id: id,
        total_berat: totalBerat,
        nama_customer: namaCustomer,
        nomer_hp: nomerKontak,
        alamat: alamatCustomer,
        estimasi_selesai: new Date(estimasiSelesai).toISOString().slice(0, 10),
      };

      try {
        console.log("Mengirim data...");
        const response = await OrderService.sendData(dataPost); // Tunggu hingga proses selesai
        console.log("Data berhasil dikirim:", response);
        router.replace("/(tabs)/history");
      } catch (error) {
        console.error("Gagal mengirim data:", error);
      }
    } else {
      console.warn("Data tidak lengkap, tidak mengirim");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen
          options={{ headerTitle: "Data tidak ditemukan", headerShown: true }}
        />
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  if (!error && !loading && data) {
    return (
      <ScrollView>
        <Stack.Screen
          options={{ headerTitle: data.nama_paket, headerShown: true }}
        />

        <View
          style={{
            shadowColor: "#000",
            borderBottomWidth: 0.1,
            padding: 10,
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0.4 },
            shadowOpacity: 0.1,
            shadowRadius: 0.44,
            elevation: 0.4,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {data.nama_paket}
          </Text>
          <View style={{ alignSelf: "flex-end" }}>
            <Text
              variant="bodyMedium"
              style={{ fontWeight: "bold", color: "#91DDCF" }}
            >
              {data.harga}/kg
            </Text>
          </View>
        </View>

        <Pressable
          style={{
            shadowColor: "#000",
            borderBottomWidth: 0.1,
            padding: 10,
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0.4 },
            shadowOpacity: 0.1,
            shadowRadius: 0.44,
            elevation: 0.4,
            marginTop: 12,
          }}
          onPress={showDatePicker}
        >
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Estimasi Selesai
          </Text>
          <Text>
            {estimasiSelesai
              ? estimasiSelesai.toLocaleDateString("id-ID")
              : "xx-xx-xxxx"}
          </Text>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </Pressable>

        <View
          style={{
            shadowColor: "#000",
            borderBottomWidth: 0.1,
            padding: 10,
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0.4 },
            shadowOpacity: 0.1,
            shadowRadius: 0.44,
            elevation: 0.4,
            marginTop: 12,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Total Berat - Biaya
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 16,
            }}
          >
            <TextInput
              activeUnderlineColor="#91DDCF"
              style={{
                backgroundColor: "none",
                flex: 1,
                borderRadius: 0,
              }}
              keyboardType="numeric"
              placeholder="0"
              value={totalBerat}
              onChangeText={(num) => setTotalBerat(num)}
            />
            <TextInput
              readOnly
              disabled
              style={{
                backgroundColor: "none",
                flex: 1,
                borderRadius: 0,
              }}
              value={`Rp${(parseFloat(totalBerat) * data.harga).toLocaleString(
                "id-ID"
              )}`}
            />
          </View>
        </View>

        <View
          style={{
            shadowColor: "#000",
            borderBottomWidth: 0.1,
            padding: 10,
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0.4 },
            shadowOpacity: 0.1,
            shadowRadius: 0.44,
            elevation: 0.4,
            marginTop: 12,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Data Customer
          </Text>

          <TextInput
            value={namaCustomer}
            onChangeText={(text) => setNamaCustomer(text)}
            label="Nama Customer"
            mode="outlined"
            activeOutlineColor="#91DDCF"
            outlineColor="#CCCCCC"
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginBottom: 16,
            }}
          />

          <TextInput
            value={nomerKontak}
            onChangeText={(text) => setNomerKontak(text)}
            label="Nomer Kontak"
            mode="outlined"
            activeOutlineColor="#91DDCF"
            outlineColor="#CCCCCC"
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginBottom: 16,
            }}
          />

          <TextInput
            value={alamatCustomer}
            onChangeText={(text) => setAlamatCustomer(text)}
            label="Alamat"
            mode="outlined"
            multiline={true}
            activeOutlineColor="#91DDCF"
            numberOfLines={10}
            outlineColor="#CCCCCC"
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              textAlignVertical: "top",
              marginBottom: 16,
            }}
          />

          <TouchableRipple
            onPress={handleSimpanData}
            style={{
              backgroundColor: "#57cb98",
              padding: 8,
              borderRadius: 30,
              alignItems: "center",
            }}
            rippleColor="rgba(56, 56, 56, 0.32)"
          >
            <Text
              style={{
                color: "#fafafa",
                fontSize: 15,
                fontWeight: "900",
              }}
            >
              Simpan
            </Text>
          </TouchableRipple>
        </View>
      </ScrollView>
    );
  }
};

export default DetailPaketScreen;

const styles = StyleSheet.create({});
