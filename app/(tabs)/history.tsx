import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import OrderStore from "../../store/OrderStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { Stack } from "expo-router";
import { router } from "expo-router";

const History = () => {
  const { order, hasMoreData, pagination, isLoading, error, fetchData } =
    OrderStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchDataNextPage = async () => {
    if (isLoading || !hasMoreData) return;

    if (pagination) {
      fetchData(pagination?.current_page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(1); // Ambil ulang data dari API
    setRefreshing(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Riwayat Pemesanan",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <View style={{ paddingHorizontal: 8, flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#91DDCF" />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
            {error}
          </Text>
        ) : (
          <FlatList
            onEndReachedThreshold={0.3}
            data={order}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4CAF50"]}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.navigate(`/detailOrder/${item.id}`)}
                style={{
                  marginVertical: 8,
                  borderRadius: 5,
                  shadowColor: "#000",
                  borderWidth: 0.1,
                  padding: 10,
                  backgroundColor: "white",
                  // Shadow untuk iOS
                  shadowOffset: { width: 0, height: 0.4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 0.44,
                  // Shadow untuk Android
                  elevation: 0.4,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                      {item.customer.nama_customer}
                    </Text>

                    <Text variant="bodySmall" style={{ fontWeight: "400" }}>
                      {item.laundry_packet.nama_paket}
                    </Text>

                    <Text variant="bodySmall" style={{ fontWeight: "400" }}>
                      Estimasi Selesai {item.estimasi_selesai}
                    </Text>

                    <Text
                      variant="bodySmall"
                      style={{
                        fontWeight: "400",
                        color:
                          item.status === "pengerjaan"
                            ? "#27548A"
                            : item.status === "batal"
                            ? "#D32F2F"
                            : item.status === "selesai"
                            ? "#388E3C"
                            : "#000000", // Default color jika tidak sesuai kondisi
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        color: "#2C3930",
                        fontSize: 18,
                        textAlign: "center",
                      }}
                    >
                      Rp{item.total_harga.toLocaleString("id-ID")}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </>
  );
};

export default History;

const styles = StyleSheet.create({});
