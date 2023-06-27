import { View, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { GlobalColors } from "../constants/colors";
import { useEffect, useState, useContext } from "react";
import Switcher from "../components/UI/Switcher";
import { AuthContext } from "../context/auth";
import {
  getUserStatusAppointments,
  getAnimalDoneAppointments,
  getNotificationsAppointment,
} from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
function NotificationsNextAppointemnt({ aid, animalName }) {
  const authCtx = useContext(AuthContext);
  const [selected, setSelected] = useState("");
  const [notificationsApp, setNotificationsApp] = useState([]);
  const [nextAppointments, setNextAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedDaterecieved, setSelctedDateReceived] = useState();
  const [notificationValue, setNotificationChanged] = useState(false);
  const [nextActiveAppointments, setNextActiveAppointments] = useState([]);
  const [datesActive, setDatesActive] = useState([]);
  const [datesFuture, setDatesFuture] = useState([]);
  useEffect(() => {
    async function getDoneApp() {
      try {
        setFetching(true);
        let aux = [];
        aux = await getAnimalDoneAppointments(authCtx.uid, aid);
        setNextAppointments(aux);
        if (aux.length > 0) setFetching(false);
        return aux;
      } catch (error) {
        console.log(error);
      }
    }
    getDoneApp();
  }, []);
  useEffect(() => {
    async function getNextPlannedApp() {
      try {
        setFetching(true);
        let active = [];
        active = await getUserStatusAppointments(authCtx.uid, 0);
        setNextActiveAppointments(
          active.filter((app) => app.animal.aid.localeCompare(aid) === 0)
        );
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getNextPlannedApp();
  }, []);
  useEffect(() => {
    setFetching(true);
    setDatesFuture(
      nextAppointments.map((app) =>
        app.result.nextAppointment.replace(/\//g, "-")
      )
    );
    setFetching(false);
  }, [nextAppointments]);

  useEffect(() => {
    setFetching(true);
    setDatesActive(nextActiveAppointments.map((app) => app.date));
    setFetching(false);
  }, [nextActiveAppointments]);
  useEffect(() => {
    async function getNotifications() {
      try {
        setFetching(true);
        let notifications = [];
        notifications = await getNotificationsAppointment(authCtx.uid, aid);
        setNotificationsApp(notifications, "notific");
        console.log(notificationsApp);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getNotifications();
  }, [selectedDaterecieved, notificationValue]);
  const markedDatesActive = datesActive.reduce((obj, date) => {
    obj[date] = { marked: true };
    return obj;
  }, {});
  const markedDates = datesFuture.reduce((obj, date) => {
    obj[date] = { marked: true };
    return obj;
  }, {});

  const selectedDate = {};
  selectedDate[selected] = { selected: true };

  const calendarTheme = {
    backgroundColor: GlobalColors.colors.gray0,
    calendarBackground: "white",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: GlobalColors.colors.pink500,
    selectedDayTextColor: GlobalColors.colors.gray0,
    todayTextColor: GlobalColors.colors.pink10,
    dayTextColor: GlobalColors.colors.pink500,
    textDisabledColor: GlobalColors.colors.gray10,
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
  const getSelectedDateInfo = () => {
    const selectedApp = nextAppointments.filter(
      (app) => app.result.nextAppointment.replace(/\//g, "-") === selected
    )[0];
    const selectedAppActive = nextActiveAppointments.filter(
      (app) => app.date === selected
    )[0];
    if (selectedApp && !selectedAppActive) {
      return (
        <View style={styles.pillCard}>
          <View style={styles.pillNameContainer}>
            <Text style={styles.pillName}>
              {new Date(selectedApp.result.nextAppointment).toLocaleDateString(
                "en",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <Text style={styles.countPill}>
              Vet's Suggestion:{" "}
              <Text style={{ color: GlobalColors.colors.pink500 }}>
                {selectedApp.result.doctorReason}{" "}
              </Text>
            </Text>
            <View style={{ position: "absolute", top: -2, left: 240 }}>
              <Switcher
                appointmentReminder={true}
                date={selectedApp.result.nextAppointment.replace(/\//g, "-")}
                active={false}
                name={animalName}
                aid={aid}
                notificationChanged={setNotificationChanged}
                notificationValue={notificationValue}
                status={notificationsApp.some(
                  (app) => app.date.localeCompare(selected) === 0
                )}
                generatedId={notificationsApp
                  .filter((app) => app.date.localeCompare(selected) === 0)
                  .map((app) => app.generatedId)}
                notificationId={notificationsApp
                  .filter((app) => app.date.localeCompare(selected) === 0)
                  .map((app) => app.notificationId)}
                setSelctedDateReceived={setSelctedDateReceived}
              />
            </View>
          </View>
        </View>
      );
    }
    if (selectedAppActive) {
      return (
        <View style={styles.pillCard}>
          <View style={styles.pillNameContainer}>
            <Text style={styles.pillName}>
              {new Date(selectedAppActive.date).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <Text style={styles.countPill}>
              Active appointment:{" "}
              <Text style={{ color: GlobalColors.colors.pink500 }}>
                {selectedAppActive.reason}{" "}
              </Text>
            </Text>
            <View style={{ position: "absolute", top: -2, left: 240 }}>
              <Switcher
                appointmentReminder={true}
                date={selectedAppActive.date}
                active={true}
                slot={selectedAppActive.slot}
                name={selectedAppActive.animal.nameA}
                aid={aid}
                notificationChanged={setNotificationChanged}
                notificationValue={notificationValue}
                generatedId={notificationsApp
                  .filter((app) => app.date.localeCompare(selected) === 0)
                  .map((app) => app.generatedId)}
                status={notificationsApp.some(
                  (app) => app.date.localeCompare(selected) === 0
                )}
                setSelctedDateReceived={setSelctedDateReceived}
              />
            </View>
          </View>
        </View>
      );
    }
    return null;
  };
  if (fetching) return <LoadingOverlay message={"Loading.."} />;
  console.log(markedDates, markedDatesActive);
  return (
    <View>
      <Calendar
        markedDates={{ ...markedDates, ...markedDatesActive }}
        onDayPress={(day) => {
          setSelected(day.dateString), console.log(selected);
        }}
        onMonthChange={() => setSelected("")}
        theme={calendarTheme}
      />
      <View style={{ marginTop: 35 }}>{getSelectedDateInfo()}</View>
    </View>
  );
}
export default NotificationsNextAppointemnt;
const styles = StyleSheet.create({
  pillCard: {
    height: 80,
    marginHorizontal: 20,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 20,
    marginVertical: 10,
    marginTop: 10,
    flexDirection: "row",
  },

  pillNameContainer: {
    backgroundColor: GlobalColors.colors.pink500,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 60,
    alignSelf: "center",
    marginLeft: 10,
  },
  pillName: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.gray0,
    textAlign: "center",
    fontSize: 11,
  },
  countPill: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
  },
});
