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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { weatherDescKo } from "./weatherDescKo";
import { GOOGLE_API_KEY, WEAHTER_API_KEY } from "@env";
import * as Location from "expo-location";

const SCREEN_WIDTH = Dimensions.get("window").width;

const myApiKey = GOOGLE_API_KEY;
const weatherApiKey = WEAHTER_API_KEY;

const RegDate = () => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const dayOfTheWeek = ["월", "화", "수", "목", "금", "토", "일"];

    // date 객체 생성
    const date = new Date();

    const options = { month: "short", day: "numeric" };
    const dateString = date.toLocaleDateString("kr", options);

    let day = date.getDay(); // 요일(요일별로 0 ~ 6을 반환)

    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = hours > 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0시 인 경우 12시
    // 0, true, null 동격

    const minuteString = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${dateString}, ${dayOfTheWeek[day]}, ${hours}:${minuteString}${ampm}`;

    setCurrentDate(formattedDate);
  }, []);

  return <Text style={styles.regDate}>{currentDate}</Text>;
};

const WeatherDesc = ({ day }) => {
  const result = weatherDescKo.find((item) => {
    const id = day.weather[0].id;
    return Object.keys(item)[0] == id;
  });

  const descRs = result
    ? Object.values(result)[0]
    : "해당하는 날씨 정보가 없습니다.";

  const iconName = result ? (
    Object.values(result)[1]
  ) : (
    <MaterialCommunityIcons name="image-filter-none" size={30} color="black" />
  );

  return (
    <>
      <Text style={styles.desc}>{descRs}</Text>
      <Text style={styles.weahtherIcon}>
        <MaterialCommunityIcons name={iconName} size={30} color="black" />
      </Text>
    </>
  );
};

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
      <View style={styles.regDateCon}>
        <RegDate />
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
                <WeatherDesc day={day} />
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
    flexDirection: "row",
  },
  regDateCon: {
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
    width: 200,
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  desc: {
    marginTop: 20,
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  weahtherIcon: {
    marginTop: 10,
    marginLeft: 10,
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
