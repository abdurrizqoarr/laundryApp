import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import PaketLaundryStore from "../store/PaketLaundryStore";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { DataPaketLaundry } from "@/interface/PaketLaundryInterface";
import { router } from "expo-router";

const ListPaketComponent = ({
  searchParam,
  clearSearch,
}: {
  searchParam: string;
  clearSearch: () => void;
}) => {
  const { paketLaundry, isLoading, error, fetchData } = PaketLaundryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFilteredData] =
    useState<DataPaketLaundry[]>(paketLaundry);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchParam.trim() === "") {
      setFilteredData(paketLaundry); // Jika input kosong, tampilkan semua data
    } else {
      const filtered = paketLaundry.filter((item) =>
        item.nama_paket.toLowerCase().includes(searchParam.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchParam, paketLaundry]);

  const onRefresh = async () => {
    setRefreshing(true);
    clearSearch();
    await fetchData(); // Ambil ulang data dari API
    setRefreshing(false);
  };

  return (
    <View style={{ padding: 16, marginTop: 20, flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#91DDCF" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={filteredData}
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
              onPress={() => router.navigate(`/detailpaket/${item.id}`)}
              style={{
                marginVertical: 8,
                borderRadius: 10,
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
              <View>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {item.nama_paket}
                </Text>
                <View style={{ alignSelf: "flex-end" }}>
                  <Text
                    variant="bodyMedium"
                    style={{ fontWeight: "bold", color: "#4CAF50" }}
                  >
                    {item.harga}/kg
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default ListPaketComponent;

const styles = StyleSheet.create({});
