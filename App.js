import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Ansan</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.regDate}>Friday, 20, January</Text>
            <Text style={styles.desc}>Sunny</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>31</Text>
          </View>
        </View>
        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.regDate}>Friday, 20, January</Text>
            <Text style={styles.desc}>Sunny</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>31</Text>
          </View>
        </View>
        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.regDate}>Friday, 20, January</Text>
            <Text style={styles.desc}>Sunny</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>31</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff42",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
  },
  weatherInner: {
    width: SCREEN_WIDTH,
  },
  day: {
    justifyContent: "center",
    alignItems: "center",
  },
  regDate: {
    borderRadius: 20,
    backgroundColor: "black",
    color: "#ffff42",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  desc: {
    marginTop: 10,
    color: "black",
    fontSize: 17,
  },
  tempCon: {
    justifyContent: "center",
    alignItems: "center",
  },
  temp: {
    color: "black",
    fontSize: 173,
  },
});
