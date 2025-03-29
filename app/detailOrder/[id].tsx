import { ScrollView, StyleSheet, Touchable, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataOrder } from "@/interface/OrderInterface";
import { useLocalSearchParams } from "expo-router";
import OrderService from "@/utils/OrderService";
import {
  ActivityIndicator,
  Modal,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";

const DetailOrderScreen = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<DataOrder>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [visibleModalCancel, setVisibleModalCancel] = React.useState(false);
  const [visibleModalSelesai, setVisibleModalSelesai] = React.useState(false);

  const showModalCancel = () => setVisibleModalCancel(true);
  const hideModalCancel = () => setVisibleModalCancel(false);

  const showModalSelesai = () => setVisibleModalSelesai(true);
  const hideModalSelesai = () => setVisibleModalSelesai(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Array.isArray(id)) {
        return;
      }

      setLoading(true);
      setError("");
      try {
        setLoading(true);
        const response = await OrderService.getDetail(id);
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

  const updateStatusPesanan = async (
    status: "selesai" | "batal",
    id: string | string[]
  ) => {
    if (!id || Array.isArray(id)) {
      return;
    }

    const resUpdate = await OrderService.updateStatus(id, status);

    if (resUpdate) {
      setData((prevData) =>
        prevData ? { ...prevData, status: resUpdate.status } : undefined
      );
      setVisibleModalCancel(false)
      setVisibleModalSelesai(false)
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  if (!error && !loading && data) {
    return (
      <>
        <Portal>
          <Modal
            visible={visibleModalCancel}
            onDismiss={hideModalCancel}
            contentContainerStyle={{
              padding: 24,
              width: "80%",
              backgroundColor: "#f1f1f1",
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Pesanan Akan Dibatalkan
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              Apakah Anda Yakin?
            </Text>

            <TouchableRipple
              onPress={() => updateStatusPesanan("batal", id)}
              style={{
                backgroundColor: "#E52020",
                marginTop: 24,
                padding: 6,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "#F1f1f1",
                  textAlign: "center",
                }}
              >
                Batalkan Pesanan
              </Text>
            </TouchableRipple>
          </Modal>

          <Modal
            visible={visibleModalSelesai}
            onDismiss={hideModalSelesai}
            contentContainerStyle={{
              padding: 24,
              width: "80%",
              backgroundColor: "#f1f1f1",
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Pesanan Akan Diselesaikan
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              Apakah Anda Yakin?
            </Text>

            <TouchableRipple
              onPress={() => updateStatusPesanan("selesai", id)}
              style={{
                backgroundColor: "#57cb98",
                marginTop: 24,
                padding: 6,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "#F1f1f1",
                  textAlign: "center",
                }}
              >
                Selesaikan Pesanan
              </Text>
            </TouchableRipple>
          </Modal>
        </Portal>
        <ScrollView>
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
              {data.customer.nama_customer}
            </Text>

            <Text
              variant="titleSmall"
              style={{ fontWeight: "400", color: "#4C585B", marginBottom: 6 }}
            >
              {data.customer.nomer_hp}
            </Text>

            <Text
              variant="titleSmall"
              style={{ fontWeight: "400", color: "#4C585B" }}
            >
              {data.customer.alamat}
            </Text>
          </View>

          <View
            style={{
              shadowColor: "#000",
              borderBottomWidth: 0.1,
              padding: 10,
              marginTop: 12,
              backgroundColor: "white",
              shadowOffset: { width: 0, height: 0.4 },
              shadowOpacity: 0.1,
              shadowRadius: 0.44,
              elevation: 0.4,
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Paket {data.laundry_packet.nama_paket}
            </Text>
          </View>

          <View
            style={{
              shadowColor: "#000",
              borderBottomWidth: 0.1,
              marginTop: 12,
              padding: 10,
              backgroundColor: "white",
              shadowOffset: { width: 0, height: 0.4 },
              shadowOpacity: 0.1,
              shadowRadius: 0.44,
              elevation: 0.4,
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Estimasi Selesai
            </Text>
            <Text>{data.estimasi_selesai}</Text>
          </View>

          <View
            style={{
              shadowColor: "#000",
              borderBottomWidth: 0.1,
              marginTop: 12,
              padding: 10,
              backgroundColor: "white",
              shadowOffset: { width: 0, height: 0.4 },
              shadowOpacity: 0.1,
              shadowRadius: 0.44,
              elevation: 0.4,
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Total
            </Text>
            <Text>
              {data.total_berat}Kg x Rp{data.laundry_packet.harga}
            </Text>
            <Text
              style={{
                textAlign: "right",
                fontWeight: 900,
              }}
            >
              Rp{data.total_harga.toLocaleString("id-ID")}
            </Text>
          </View>

          {data.status === "pengerjaan" && (
            <View
              style={{
                shadowColor: "#000",
                flex: 1,
                flexDirection: "row",
                gap: 12,
                borderBottomWidth: 0.1,
                marginTop: 12,
                padding: 10,
                backgroundColor: "white",
                shadowOffset: { width: 0, height: 0.4 },
                shadowOpacity: 0.1,
                shadowRadius: 0.44,
                elevation: 0.4,
              }}
            >
              <TouchableRipple
                onPress={showModalCancel}
                style={{
                  flex: 1,
                  backgroundColor: "#E52020",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "#F1f1f1",
                    textAlign: "center",
                  }}
                >
                  Batalkan Pesanan
                </Text>
              </TouchableRipple>

              <TouchableRipple
                onPress={showModalSelesai}
                style={{
                  flex: 1,
                  backgroundColor: "#57cb98",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "#fafafa",
                    textAlign: "center",
                  }}
                >
                  Selesaikan Pesanan
                </Text>
              </TouchableRipple>
            </View>
          )}

          {data.status === "selesai" && (
            <View
              style={{
                shadowColor: "#000",
                borderBottomWidth: 0.1,
                marginTop: 12,
                padding: 10,
                backgroundColor: "white",
                shadowOffset: { width: 0, height: 0.4 },
                shadowOpacity: 0.1,
                shadowRadius: 0.44,
                elevation: 0.4,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Pesanan Telah Selesai Dilayani
              </Text>
            </View>
          )}

          {data.status === "batal" && (
            <View
              style={{
                shadowColor: "#000",
                borderBottomWidth: 0.1,
                marginTop: 12,
                padding: 10,
                backgroundColor: "white",
                shadowOffset: { width: 0, height: 0.4 },
                shadowOpacity: 0.1,
                shadowRadius: 0.44,
                elevation: 0.4,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Pesanan Telah Dibatalkan
              </Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  }
};

export default DetailOrderScreen;

const styles = StyleSheet.create({});
