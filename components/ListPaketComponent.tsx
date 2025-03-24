import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import PaketLaundryStore from "../store/PaketLaundryStore";
import { FlatList } from "react-native-gesture-handler";

const ListPaketComponent = () => {
  const { paketLaundry, isLoading, error, fetchData } = PaketLaundryStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={paketLaundry} // Data yang akan di-mapping
        keyExtractor={(item) => item.id.toString()} // Pastikan key unik
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.nama_paket}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ListPaketComponent;

const styles = StyleSheet.create({});
