import ListPaketComponent from "@/components/ListPaketComponent";
import { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Searchbar, Text } from "react-native-paper";

export default function HomeScreen() {
  const [searchPaket, setSearchPaket] = useState<string>("");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: "24%",
            backgroundColor: "#91DDCF",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              paddingHorizontal: 20,
              paddingBottom: 6,
              fontWeight: "bold",
              fontSize: 32,
              fontFamily: "Nunito",
              color: "#3E3F5B",
            }}
          >
            Select Your Service
          </Text>
          <Text
            style={{
              paddingHorizontal: 20,
              paddingBottom: 6,
              color: "#3E3F5B",
              fontWeight: "600",
              fontSize: 15,
              fontFamily: "Nunito",
            }}
          >
            Cuci Kering, Setrika, Lipat
          </Text>

          <Searchbar
            clearButtonMode="never"
            value={searchPaket}
            onChangeText={(text) => setSearchPaket(text)}
            placeholder="cari paket"
            style={{
              width: "90%",
              position: "absolute",
              bottom: -20,
              backgroundColor: "#fafafa",
              borderWidth: 0.2,
              alignSelf: "center",
            }}
          />
        </View>

        <ListPaketComponent
          searchParam={searchPaket}
          clearSearch={() => setSearchPaket("")}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});
