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

const useRegDate = () => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    // date 객체 생성
    const date = new Date();

    const options = { month: "short", day: "numeric" };
    const dateString = date.toLocaleDateString("ko", options);

    const weekday = date.toLocaleDateString("ko", { weekday: "short" });
    const weekdayFormat = weekday.replace(/(\(.*?\))/g, "").trim(); // 정규표현식 통해 소괄호 제거

    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = hours > 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0시 인 경우 12시
    // 0, true, null 동격

    const minuteString = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${dateString}, ${weekdayFormat}, ${hours}:${minuteString}${ampm}`;

    setCurrentDate(formattedDate);
  }, []);

  return currentDate;
};

const GetWeekDays = ({ dt }) => {
  const [day, setDay] = useState(null);

  useEffect(() => {
    // date 객체 생성
    const date = new Date(dt * 1000);

    const weekday = date.toLocaleDateString("ko", { weekday: "short" });
    const weekdayFormat = weekday.replace(/(\(.*?\))/g, "").trim(); // 정규표현식 통해 소괄호 제거

    setDay(weekdayFormat);
  }, []);

  return <Text style={styles.dayInfoText}>{day}</Text>;
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
        <MaterialCommunityIcons name={iconName} size={35} color="black" />
      </Text>
    </>
  );
};

export default function App() {
  const [city, setCity] = useState("Loding...");
  const [dailyWeather, setDailyWeather] = useState([]);
  const currentDate = useRegDate();

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

    // 위치 정보를 기반으로 지역명 가져오기
    const addressComponents = jsonFroLocation.results[5].address_components;
    const cityAdress = addressComponents[2].long_name;

    setCity(cityAdress);

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&lang=kr&appid=${weatherApiKey}`;

    const responseToWeahter = await fetch(weatherApiUrl);
    const jsonForWeahter = await responseToWeahter.json();
    setDailyWeather(jsonForWeahter.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.myLocation}>나의 위치</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.regDateCon}>
        <Text style={styles.regDate}>{currentDate}</Text>
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
              <View style={styles.otherInfo}>
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitle}>Weekly Weather</Text>
                </View>
                <View style={styles.otherInfoInner}>
                  <View style={styles.infoItem}>
                    <GetWeekDays dt={day.dt} />
                  </View>
                  <View style={styles.infoItem}>
                    <View style={styles.tempInfo}>
                      <Text style={styles.tempSub}>
                        {parseFloat(day.temp.min).toFixed(0)}
                      </Text>
                      <Text style={styles.degreeSymbolSmall}>°</Text>
                    </View>
                    <Text style={styles.tempText}>최저온도</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <View style={styles.tempInfo}>
                      <Text style={styles.tempSub}>
                        {parseFloat(day.temp.max).toFixed(0)}
                      </Text>
                      <Text style={styles.degreeSymbolSmall}>°</Text>
                    </View>
                    <Text style={styles.tempText}>최고온도</Text>
                  </View>
                </View>
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
  myLocation: {
    fontWeight: "bold",
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 5,
  },
  weatherInner: {
    width: SCREEN_WIDTH,
    marginTop: 15,
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
    overflow: "hidden",
  },
  desc: {
    marginTop: 20,
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  weahtherIcon: {
    marginTop: 18,
    marginLeft: 10,
  },
  tempCon: {
    justifyContent: "center",
    alignItems: "center",
  },
  temp: {
    color: "black",
    fontSize: 173,
  },
  degreeSymbol: {
    fontSize: 150,
    position: "absolute",
    top: 1,
    right: 35,
  },
  infoTitleBox: {
    width: 300,
    alignSelf: "center",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 13,
    marginBottom: 10,
  },
  otherInfoInner: {
    alignSelf: "center",
    width: 300,
    height: 120,
    backgroundColor: "black",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    borderWidth: 2,
  },
  dayInfoText: {
    fontSize: 60,
    color: "white",
    paddingLeft: 8,
  },
  tempSub: {
    fontSize: 40,
    color: "white",
  },
  degreeSymbolSmall: {
    position: "absolute",
    color: "white",
    fontSize: 30,
    top: 2,
    right: -12,
  },
  tempText: {
    color: "white",
    fontWeight: "bold",
  },
});
