import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { AuthContext } from "../context/auth";
import { useContext } from "react";
import { GlobalColors } from "../constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import AppointmentCard from "../components/Appointments/AppointmentCard";
import { useFonts } from "expo-font";
import { getAppointments } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { getFormattedDate } from "../util/date";

function DoctorScreen({ navigation }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerRight: () => (
      <View>
        <Feather
          name="calendar"
          color={GlobalColors.colors.pink500}
          onPress={() => setShowDatePicker(true)}
          size={20}
          style={styles.headerIcon}
        />
      </View>
    ),
  });

  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
    "Roboto-Regular": require("../constants/fonts/Roboto-Regular.ttf"),
  });

  const authCtx = useContext(AuthContext);

  let currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  currentDate = new Date(romanianTime);
  const auxDate = new Date(currentDate);
  if (
    auxDate instanceof Date &&
    (auxDate.getUTCDay() === 6 || auxDate.getUTCDay() === 0)
  ) {
    const daysToAdd = auxDate.getUTCDay() === 0 ? 1 : 2;
    auxDate.setUTCDate(auxDate.getUTCDate() + daysToAdd);
  }
  const [date, setDate] = useState(new Date(auxDate));
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [selectedMonth, setSelectedMonth] = useState(auxDate.getUTCMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(auxDate.getUTCFullYear());

  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);

  const monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarTheme = {
    backgroundColor: GlobalColors.colors.gray0,
    calendarBackground: GlobalColors.colors.gray0,
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: GlobalColors.colors.pink500,
    selectedDayTextColor: GlobalColors.colors.gray0,
    todayTextColor: GlobalColors.colors.pink500,
    dayTextColor: GlobalColors.colors.pink500,
    textDisabledColor: GlobalColors.colors.darkGrey,
    dotColor: GlobalColors.colors.pink500,
    selectedDotColor: GlobalColors.colors.pink500,
    arrowColor: GlobalColors.colors.pink500,
    disabledArrowColor: "#d9e1e8",
    monthTextColor: GlobalColors.colors.pink500,
    indicatorColor: GlobalColors.pink500,
    textDayFontFamily: "Garet-Book",
    textMonthFontFamily: "Garet-Book",
    textDayHeaderFontFamily: "Garet-Book",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };
  const getWeekendDaysInMonth = (year, month) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    let weekendDays = {};
    console.log(startDate, endDate);
    for (
      let dateAux = startDate;
      dateAux <= endDate;
      dateAux.setUTCDate(dateAux.getUTCDate() + 1)
    ) {
      const dayOfWeek = dateAux.getUTCDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const dateString = getFormattedDate(dateAux);
        console.log("daa");
        weekendDays[dateString] = { disabled: true, disableTouchEvent: true };
      }
    }
    return weekendDays;
  };
  const [markedDates, setMarkedDates] = useState(
    getWeekendDaysInMonth(auxDate.getUTCFullYear(), auxDate.getUTCMonth())
  );
  markedDates[getFormattedDate(selectedDate)] = { selected: true };

  const swiper = useRef();
  const formattedMonth = monthNames[date.getUTCMonth()];

  const handleNextDay = () => {
    const nextDateAux = new Date(date);

    if (nextDateAux.getDay() === 5) {
      nextDateAux.setDate(date.getUTCDate() + 3);
    } else nextDateAux.setDate(date.getUTCDate() + 1);
    Object.keys(markedDates).forEach(
      (obj) => (markedDates[obj]["selected"] = false)
    );
    setDate(nextDateAux);
    setSelectedDate(nextDateAux);
  };

  const handlePrevDay = () => {
    const prevDateAux = new Date(date);

    if (prevDateAux.getDay() === 1) {
      prevDateAux.setDate(date.getDate() - 3);
    } else prevDateAux.setDate(date.getDate() - 1);

    Object.keys(markedDates).forEach(
      (obj) => (markedDates[obj]["selected"] = false)
    );
    setDate(prevDateAux);
    setSelectedDate(prevDateAux);
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
        const resp = await getAppointments(
          authCtx.uid,
          getFormattedDate(selectedDate)
        );
        console.log(resp);
        setAppointments(resp);
        console.log(appointments);

        const tomorrow = new Date(currentDate);

        const tomorrowFormatted = `${tomorrow.getUTCFullYear()}-${String(
          tomorrow.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(tomorrow.getUTCDate()).padStart(2, "0")}`;
        if (
          getFormattedDate(selectedDate) === tomorrowFormatted &&
          appointments.length > 0
        ) {
          console.log("daaa");
          for (const key in appointments) {
            scheduleNotificationHandler(
              appointments[key].did,
              appointments[key].slot,
              appointments[key].date
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
      setFetching(false);
    }
    getDoctorsAppointments();
  }, [selectedDate]);

  useEffect(() => {
    setMarkedDates(getWeekendDaysInMonth(selectedYear, selectedMonth));
  }, [selectedMonth]);

  if (!fonts) {
    return null;
  }
  if (fetching) return;
  <LoadingOverlay message={"Loading..."} />;
  const renderDate = (date, index) => {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;

    return (
      <TouchableOpacity onPress={() => onDateSelect(date)} disabled={isWeekend}>
        <View
          style={[
            date.toLocaleDateString() === selectedDate.toLocaleDateString()
              ? [styles.containerdate, styles.selectedDate]
              : styles.containerdate,
            isWeekend && {
              opacity: 0.5,
              backgroundColor: GlobalColors.colors.gray0,
            },
          ]}
          key={index}
        >
          <>
            <Text style={styles.itemWeekday}>
              {daysOfWeek[date.getUTCDay()]}
            </Text>
            <Text style={styles.itemDate}>{date.getUTCDate()}</Text>
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
          {selectedDate.getUTCDate()} {formattedMonth}{" "}
          {selectedDate.getUTCFullYear()}
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
              ? `You ${
                  getFormattedDate(selectedDate) <
                    getFormattedDate(currentDate) ||
                  (getFormattedDate(selectedDate) ===
                    getFormattedDate(currentDate) &&
                    currentDate.getUTCHours() >= 18)
                    ? `had`
                    : `have`
                } ${appointments.length} appointment ${
                  getFormattedDate(selectedDate) !==
                  getFormattedDate(currentDate)
                    ? `on selected date`
                    : `today`
                }`
              : `You ${currentDate.getUTCHours() < 18 ? `have` : `had`} ${
                  appointments.length
                } appointments today`
            : `You ${
                getFormattedDate(selectedDate) <
                  getFormattedDate(currentDate) ||
                (getFormattedDate(selectedDate) ===
                  getFormattedDate(currentDate) &&
                  currentDate.getUTCHours() >= 18)
                  ? `had`
                  : `have`
              } no appointments ${
                getFormattedDate(selectedDate) !== getFormattedDate(currentDate)
                  ? `on this date`
                  : `today`
              }`}
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
              { top: -9, fontSize: 19 },
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
      <Modal animationType="slide" transparent={true} visible={showDatePicker}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Ionicons
                name="close-circle-outline"
                color={GlobalColors.colors.pink500}
                size={30}
                style={{ left: -150, top: -20 }}
              />
            </TouchableOpacity>
            <View style={{ width: "100%" }}>
              <Calendar
                onDayPress={(date) => {
                  markedDates[getFormattedDate(selectedDate)] = {
                    selected: false,
                  };
                  setDate(new Date(date.dateString)),
                    setSelectedDate(new Date(date.dateString));
                  markedDates[selectedDate] = { selected: true };

                  setShowDatePicker(false);
                  setSelectedMonth(date.month);
                  setSelectedYear(date.year);
                }}
                theme={calendarTheme}
                onMonthChange={(date) => {
                  console.log(date),
                    setSelectedMonth(date.month),
                    setSelectedYear(date.year);
                }}
                markedDates={markedDates}
                current={selectedDate}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    top: 30,
    fontSize: 28,
  },
  appointments: {
    color: GlobalColors.colors.mint1,
    marginLeft: 40,
    top: 30,
    fontSize: 15,
    fontFamily: "Garet-Book",
  },
  datespicker: {
    flex: 1,
    maxHeight: 500,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    top: 40,
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
    borderColor: GlobalColors.colors.pink500,
  },
  appointmentsContainer: {
    flex: 1,
    top: -200,
  },
  modal: {
    backgroundColor: "white",
    alignSelf: "center",
    height: 500,
    marginHorizontal: 30,

    flex: 1,
    marginTop: 200,
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
    shadowRadius: 4,
  },
  headerIcon: {
    right: 15,
    bottom: 2,
  },
});
