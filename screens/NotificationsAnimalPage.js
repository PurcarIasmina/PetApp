import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState, useLayoutEffect } from "react";
import { AuthContext } from "../context/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import {
  calculateAnimalPillDays,
  getAnimalDoneAppointments,
  getNotifications,
} from "../store/databases";
import SwiperDays from "../components/UI/SwiperDays";
import { GlobalColors } from "../constants/colors";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Switcher from "../components/UI/Switcher";
import { getFormattedDate } from "../util/date";

function NotificationsAnimalPage({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0,
      borderBottomColor: "white",
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
  });

  const route = useRoute();
  const authCtx = useContext(AuthContext);
  const [aid, setAid] = [route.params ? route.params.aid : null];
  const [name, setName] = [route.params ? route.params.animalName : null];
  const [pills, setPills] = useState([]);
  const [pillsFoSelected, setPillsForSelected] = useState([]);
  const [notificationsForSelectedDay, setNotificationsForSelectedDay] =
    useState([]);
  const [fetching, setFetching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  let resp = [];
  let aux = [];
  const [Morning, setMorning] = useState(false);
  const [Lunch, setLunch] = useState(false);
  const [Evening, setEvening] = useState(false);
  const [notificationChanged, setNotificationChanged] = useState(false);
  const currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  const [selectedDaterecieved, setSelctedDateReceived] = useState(
    getFormattedDate(new Date(romanianTime))
  );
  useEffect(() => {
    async function getPillPlan() {
      try {
        setFetching(true);
        aux = await getAnimalDoneAppointments(authCtx.uid, aid);
        resp = calculateAnimalPillDays(aux);
        console.log(resp);
        setPills(resp);
        setFetching(false);
        return resp;
      } catch (error) {
        console.log(error);
      }
    }

    getPillPlan().then((resp) => {
      setPillsForSelected(
        resp.filter((pill) => {
          const firstDay = getFormattedDate(new Date(pill.pillFirstDay));
          const lastDay = getFormattedDate(new Date(pill.pillLastDay));
          console.log(
            getFormattedDate(new Date(romanianTime)).localeCompare(lastDay) <= 0
          );
          return (
            getFormattedDate(new Date(romanianTime)).localeCompare(firstDay) >=
              0 &&
            getFormattedDate(new Date(romanianTime)).localeCompare(lastDay) <= 0
          );
        })
      );

      console.log(pillsFoSelected);
      setMorning(
        resp
          .filter((pill) => {
            const firstDay = getFormattedDate(new Date(pill.pillFirstDay));
            const lastDay = getFormattedDate(new Date(pill.pillLastDay));
            return (
              getFormattedDate(new Date(romanianTime)).localeCompare(
                firstDay
              ) >= 0 &&
              getFormattedDate(new Date(romanianTime)).localeCompare(lastDay) <=
                0
            );
          })
          .some((pill) => pill.pillMomentDay.Morning)
      );
      setLunch(
        resp
          .filter((pill) => {
            const firstDay = getFormattedDate(new Date(pill.pillFirstDay));
            const lastDay = getFormattedDate(new Date(pill.pillLastDay));
            return (
              getFormattedDate(new Date(romanianTime)).localeCompare(
                firstDay
              ) >= 0 &&
              getFormattedDate(new Date(romanianTime)).localeCompare(lastDay) <=
                0
            );
          })
          .some((pill) => pill.pillMomentDay.Lunch)
      );
      setEvening(
        resp
          .filter((pill) => {
            const firstDay = getFormattedDate(new Date(pill.pillFirstDay));
            const lastDay = getFormattedDate(new Date(pill.pillLastDay));
            return (
              getFormattedDate(new Date(romanianTime)).localeCompare(
                firstDay
              ) >= 0 &&
              getFormattedDate(new Date(romanianTime)).localeCompare(lastDay) <=
                0
            );
          })
          .some((pill) => pill.pillMomentDay.Evening)
      );
    });
  }, []);

  useEffect(() => {
    async function getNotificationss() {
      try {
        setFetching(true);
        let auxvect = [];
        auxvect = await getNotifications(authCtx.uid, aid);
        setNotificationsForSelectedDay(
          auxvect.filter(
            (notification) =>
              notification.date.localeCompare(selectedDaterecieved) === 0
          )
        );

        setNotifications(auxvect);
        setFetching(false);
        console.log(notificationsForSelectedDay, "aloooo");
      } catch (error) {
        console.log(error);
      }
    }
    getNotificationss();
  }, [notificationChanged]);
  useEffect(() => {
    setMorning(pillsFoSelected.some((pill) => pill.pillMomentDay.Morning));
    setLunch(pillsFoSelected.some((pill) => pill.pillMomentDay.Lunch));
    setEvening(pillsFoSelected.some((pill) => pill.pillMomentDay.Evening));
  }, [selectedDaterecieved]);
  //   useEffect(() => {
  //     async function getNotificationss() {
  //       try {
  //         setFetching(true);
  //         let auxvect = [];
  //         auxvect = await getNotifications(authCtx.uid, aid);
  //         setNotificationsForSelectedDay(
  //           auxvect.filter(
  //             (notification) =>
  //               notification.date.localeCompare(selectedDaterecieved) === 0
  //           )
  //         );
  //         setSelctedDateReceived(selectedDaterecieved);
  //         setNotifications(auxvect);
  //         setFetching(false);
  //         console.log(notifications);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     getNotificationss();
  //   }, [notificationChanged]);

  function getPills(selectedDate) {
    setFetching(true);
    setPillsForSelected(
      pills.filter((pill) => {
        const firstDay = pill.pillFirstDay;
        const lastDay = pill.pillLastDay;
        return (
          getFormattedDate(new Date(selectedDate)).localeCompare(firstDay) >=
            0 &&
          getFormattedDate(new Date(selectedDate)).localeCompare(lastDay) <= 0
        );
      })
    );
    console.log(pillsFoSelected);
    setSelctedDateReceived(selectedDate);
    setNotificationsForSelectedDay(
      notifications.filter(
        (notification) => notification.date.localeCompare(selectedDate) === 0
      )
    );
    console.log(selectedDate);

    setFetching(false);
  }
  const renderItem = (item, index, momenTime) => (
    <View style={styles.pillCard}>
      <View style={styles.pillNameContainer}>
        <Text style={styles.pillName}>{item.pillName}</Text>
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
          How many: {item.pillCount} {item.pillCount > 1 ? `pills` : `pill`}{" "}
        </Text>
        <View style={{ position: "absolute", top: -2, left: 140 }}>
          <Switcher
            aid={aid}
            name={name}
            momentTime={momenTime}
            pill={item.pillName}
            date={selectedDaterecieved}
            status={notificationsForSelectedDay.some(
              (notification) =>
                notification.pill.localeCompare(item.pillName) === 0 &&
                notification.momentTime.localeCompare(momenTime) === 0
            )}
            notificationChanged={setNotificationChanged}
            notificationValue={notificationChanged}
            generatedId={
              notificationsForSelectedDay.find(
                (notification) =>
                  notification.pill.localeCompare(item.pillName) === 0 &&
                  notification.momentTime.localeCompare(momenTime) === 0
              )
                ? notificationsForSelectedDay.find(
                    (notification) =>
                      notification.pill.localeCompare(item.pillName) === 0 &&
                      notification.momentTime.localeCompare(momenTime) === 0
                  ).generatedId
                : null
            }
            setSelctedDateReceived={setSelctedDateReceived}
          />
        </View>
      </View>
      {item.additionalInfo.length > 0 && (
        <View>
          <Text> item.additionalInfo</Text>
        </View>
      )}
    </View>
  );
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        {pills.length > 0 && (
          <View>
            <SwiperDays
              pills={pills}
              handlerGetPills={getPills}
              notifications={notifications}
              date={selectedDaterecieved}
            />

            <View style={styles.listContainer}>
              {Morning && (
                <>
                  <View style={styles.momentDayContainer}>
                    <Text style={styles.momentDayText}> Morning</Text>
                    <MaterialCommunityIcon
                      name="coffee"
                      color={GlobalColors.colors.pink500}
                      size={18}
                      style={{ top: 5, left: 7 }}
                    />
                  </View>
                  <FlatList
                    data={pills.filter((pill) => {
                      const firstDay = pill.pillFirstDay;
                      const lastDay = pill.pillLastDay;
                      return (
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(firstDay) >= 0 &&
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(lastDay) <= 0 &&
                        pill.pillMomentDay.Morning
                      );
                    })}
                    renderItem={({ item, index }) =>
                      renderItem(item, index, "Morning")
                    }
                    keyExtractor={(item) => Math.random()}
                  />
                </>
              )}
              {Lunch && (
                <>
                  <View style={styles.momentDayContainer}>
                    <Text style={styles.momentDayText}> Lunch</Text>
                    <MaterialCommunityIcon
                      name="food-variant"
                      color={GlobalColors.colors.pink500}
                      size={18}
                      style={{ top: 5, left: 7 }}
                    />
                  </View>
                  <FlatList
                    data={pills.filter((pill) => {
                      const firstDay = pill.pillFirstDay;
                      const lastDay = pill.pillLastDay;
                      return (
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(firstDay) >= 0 &&
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(lastDay) <= 0 &&
                        pill.pillMomentDay.Lunch
                      );
                    })}
                    renderItem={({ item, index }) =>
                      renderItem(item, index, "Lunch")
                    }
                    keyExtractor={(item) => Math.random()}
                  />
                </>
              )}
              {Evening && (
                <>
                  <View style={styles.momentDayContainer}>
                    <Text style={styles.momentDayText}> Evening</Text>
                    <MaterialCommunityIcon
                      name="bed-empty"
                      color={GlobalColors.colors.pink500}
                      size={18}
                      style={{ top: 5, left: 7 }}
                    />
                  </View>
                  <FlatList
                    data={pills.filter((pill) => {
                      const firstDay = pill.pillFirstDay;
                      const lastDay = pill.pillLastDay;
                      return (
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(firstDay) >= 0 &&
                        getFormattedDate(
                          new Date(selectedDaterecieved)
                        ).localeCompare(lastDay) <= 0 &&
                        pill.pillMomentDay.Evening
                      );
                    })}
                    renderItem={({ item, index }) =>
                      renderItem(item, index, "Evening")
                    }
                    keyExtractor={(item) => Math.random()}
                  />
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
export default NotificationsAnimalPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  swiperContainer: {
    marginTop: 10,
  },
  pillCard: {
    height: 80,
    marginHorizontal: 20,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: "row",
  },
  listContainer: {
    marginTop: 30,
  },
  momentDayText: {
    fontSize: 18,
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
  },
  momentDayContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    left: 40,
  },
  pillNameContainer: {
    backgroundColor: GlobalColors.colors.pink500,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 30,
    marginVertical: 25,
    marginLeft: 20,
  },
  pillName: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.gray0,
  },
  countPill: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
  },
});
