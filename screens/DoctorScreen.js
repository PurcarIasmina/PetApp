import {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  setTimeout,
} from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { AuthContext } from "../context/auth";
import { useContext, useCallback } from "react";
import { GlobalColors } from "../constants/colors";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { JumpingTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import moment from "moment";
import AppointmentCard from "../components/Appointments/AppointmentCard";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { getAppointments } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { getFormattedDate } from "../util/date";
SplashScreen.preventAutoHideAsync();

function DoctorScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
    }),
      [navigation];
  });
  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
    "Roboto-Regular": require("../constants/fonts/Roboto-Regular.ttf"),
  });

  const authCtx = useContext(AuthContext);
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(date);
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const monthNames = [
    "Ian.",
    "Feb.",
    "Mar.",
    "Apr.",
    "Mai",
    "Iun.",
    "Iul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const swiper = useRef();
  const formattedMonth = monthNames[date.getMonth()];

  const handlePrevDay = () => {
    const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    setDate(prevDate);
    setSelectedDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    setDate(nextDate);
    setSelectedDate(nextDate);
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    setDate(date);
  };
  const daysToShow = 5;
  const prevDate = moment(selectedDate).subtract(daysToShow / 2 - 1, "days");
  const nextDate = moment(selectedDate).add(daysToShow / 2, "days");
  useEffect(() => {
    async function getDoctorsAppointments() {
      try {
        setFetching(true);
        console.log(getFormattedDate(selectedDate));
        const resp = await getAppointments(
          authCtx.uid,
          getFormattedDate(selectedDate)
        );
        setAppointments(resp);
        console.log(appointments);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getDoctorsAppointments();
  }, [selectedDate]);
  const onLayoutRootView = useCallback(async () => {
    if (fonts) {
      await SplashScreen.hideAsync();
    }
  }, [fonts]);

  if (!fonts) {
    return null;
  }

  const renderDate = (date, index) => {
    return (
      <TouchableOpacity
        onPress={() => onDateSelect(date)}
        onLayout={onLayoutRootView}
      >
        <View
          style={
            date.toDateString() === selectedDate.toDateString()
              ? [styles.containerdate, styles.selectedDate]
              : styles.containerdate
          }
          key={index}
        >
          <>
            <Text style={styles.itemWeekday}>
              {date.toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </Text>
            <Text style={styles.itemDate}>
              {date.toLocaleDateString("en-US", {
                day: "numeric",
              })}
            </Text>
          </>
        </View>
      </TouchableOpacity>
    );
  };
  if (fetching) return <LoadingOverlay message="Loading..." />;
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={handlePrevDay}>
          <Ionicons
            style={styles.arrows}
            name="arrow-back-circle-outline"
            size={25}
          ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.day}>
          {date.getDate()} {formattedMonth} {date.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Ionicons
            style={styles.arrows}
            name="arrow-forward-circle-outline"
            size={25}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.bolt}>
        <Text style={styles.welcomeMessage}>Hello, Dr. {authCtx.name}</Text>
        <Text style={styles.appointments}>
          {appointments.length > 0
            ? appointments.length === 1
              ? `You have ${appointments.length} appointment today`
              : `You have ${appointments.length} appointments today`
            : `You have no appointments today`}
        </Text>
        <View style={styles.datespicker}>
          <Swiper
            index={daysToShow / 2}
            ref={swiper}
            removeClippedSubviews={false}
            scrollEnabled={true}
            horizontal
          >
            <View style={styles.daterow}>
              {[...Array(daysToShow)].map((_, index) => {
                const date = moment(prevDate).add(index, "days");
                return renderDate(date.toDate(), index);
              })}
            </View>
          </Swiper>
        </View>
        <View style={styles.appointmentsContainer}>
          <Text
            style={[
              styles.welcomeMessage,
              { marginTop: 18, fontSize: 19 },
              appointments.length === 0 && { marginTop: 50 },
            ]}
          >
            {appointments.length > 0
              ? " Upcoming appointments"
              : "No appointments"}
          </Text>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FlatList
              data={appointments}
              renderItem={({ item }) => {
                return <AppointmentCard appointment={item} />;
              }}
              keyExtractor={(item) => item.generatedId}
            ></FlatList>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
export default DoctorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: GlobalColors.colors.pink10,
  },
  bolt: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 160,
    flex: 1,
    backgroundColor: "white",
    top: 60,
  },
  day: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 90,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.white1,
  },
  arrows: {
    color: "white",
    marginTop: 90,
    paddingHorizontal: 8,
  },
  welcomeMessage: {
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
    marginLeft: 40,
    top: -30,
    fontSize: 28,
  },
  appointments: {
    color: GlobalColors.colors.mint1,
    marginLeft: 40,
    top: -20,
    fontSize: 15,
    fontFamily: "Garet-Book",
  },
  datespicker: {
    flex: 1,
    maxHeight: 500,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  daterow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },

  containerdate: {
    height: 55,
    width: 50,
    marginHorizontal: 15,
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e3e3e3",
    flexDirection: "column",
    alignItems: "center",
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: GlobalColors.colors.pink500,
  },
  selectedDate: {
    backgroundColor: GlobalColors.colors.white1,
  },
  appointmentsContainer: {
    flex: 1,
    top: -200,
  },
});
