import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { GOOGLE_API_KEY } from "@env";
import * as Location from "expo-location";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [ok, setOk] = useState(true);

  const locationData = async () => {
    /*
    const permission = await Location.requestForegroundPermissionsAsync();
    console.log(permission);
    */

    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false); // 권한 부여 실패, 해당 값에 따라 다른 UI창을 보여줄 수 있음
      setErrorMsg("위치에 대한 권한 부여가 거부되었습니다.");

      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const myApiKey = GOOGLE_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    /*
    const address = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: true }
    );

    console.log(address);
    console.log(address[0].city);

    const cityAdress = address[0].city;
    */

    const cityAdress = data.results[5].formatted_address;
    setCity(cityAdress);
    console.log(cityAdress);
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
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
            <Text style={styles.temp}>29</Text>
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
