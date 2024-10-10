import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GOOGLE_API_KEY, WEAHTER_API_KEY } from "@env";
import * as Location from "expo-location";

const SCREEN_WIDTH = Dimensions.get("window").width;

const myApiKey = GOOGLE_API_KEY;
const weatherApiKey = WEAHTER_API_KEY;

export default function App() {
  const [city, setCity] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false); // 권한 부여 실패, 해당 값에 따라 다른 UI창을 보여줄 수 있음
      setErrorMsg("위치에 대한 권한 부여가 거부되었습니다.");

      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`;

    const responseToLocation = await fetch(apiUrl);
    const jsonFroLocation = await responseToLocation.json();

    const addressComponents = jsonFroLocation.results[5].address_components;

    const cityAdress = addressComponents
      .slice(0, 3) // 고잔동 단원구 안산시
      .reverse()
      .map((el) => el.long_name)
      .join(" ");

    setCity(cityAdress);

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&lang=kr&appid=${weatherApiKey}`;

    const responseToWeahter = await fetch(weatherApiUrl);
    const jsonForWeahter = await responseToWeahter.json();
    console.log(jsonForWeahter.daily);
    setDailyWeather(jsonForWeahter.daily);
  };

  useEffect(() => {
    getWeather();
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
        {dailyWeather.length === 0 ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator color="#00ff00" size="large" />
          </View>
        ) : (
          dailyWeather.map((day, index) => (
            <View key={index} style={styles.weatherInner}>
              <View style={styles.day}>
                {/* <Text style={styles.desc}>{day.weather[0].main}</Text> */}
                <Text style={styles.desc}>{day.weather[0].description}</Text>
              </View>
              <View style={styles.tempCon}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(0)}
                </Text>
                <Text style={styles.degreeSymbol}>°</Text>
              </View>
            </View>
          ))
        )}
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
    fontSize: 40,
    fontWeight: "bold",
  },
  tempCon: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  temp: {
    color: "black",
    fontSize: 173,
  },
  degreeSymbol: {
    fontSize: 150,
    position: "absolute",
    top: 5,
    right: 50,
  },
});
