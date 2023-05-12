import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Text, SafeAreaView, View } from "react-native";

import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";

import {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import { GlobalColors } from "./constants/colors";
import Register from "./screens/Register";
import Login from "./screens/Login";
import HomeScreenUser from "./screens/HomeScreenUser";
import PetScreen from "./screens/PetScreen";
import AuthContextProvider, { AuthContext } from "./context/auth";
import UserAnimalsScreen from "./screens/UserAnimalsScreen";
import ChatScreen from "./screens/ChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDrawer from "./components/UI/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import AddPetScreen from "./screens/AddPetScreen";
import DoctorScreen from "./screens/DoctorScreen";
import UserAppointments from "./screens/UserAppointments";
import DoctorProfile from "./screens/DoctorProfile";
import DoctorEditCard from "./components/Appointments/DoctorEditCard";
import DoctorBookAppointment from "./screens/DoctorBookAppointment";
import AppointmentResult from "./screens/AppointmentResult";
import AnimalPlan from "./screens/AnimalPlan";
import DoseCardPlan from "./screens/DoseCardPlan";
import AnimalRecords from "./screens/AnimalRecords";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  scheduleNotificationHandler,
  sendPushNotificationHandler,
} from "./notifications/notifications";
import {
  getDoctorsList,
  getNotifications,
  getTokens,
  getUserAppointmentsNotifications,
  getUserNotifications,
  getUnreadMessagesCount,
} from "./store/databases";
import NotificationsAnimalPage from "./screens/NotificationsAnimalPage";
import { getFormattedDate } from "./util/date";
import * as TaskManager from "expo-task-manager";
import moment from "moment";
import ChatScreenList from "./screens/ChatScreenList";
import ChatListDoctor from "./screens/ChatListDoctor";
import AddFilesScreen from "./screens/AddFilesScreen";
import FloatingIcon from "./components/UI/FloatingIcon";
import PetHotel from "./screens/PetHotel";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import BookHotel from "./screens/BookHotel";
import PayScreen from "./screens/PayScreen";
import UserReservations from "./screens/UserReservations";
import { LogBox } from "react-native";
// const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   ({ data, error, executionInfo }) => {
//     if (error) {
//       console.log("error occurred");
//     }
//     if (data) {
//       console.log("data-----", data);
//     }
//   }
// );

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs(true);
function AuthenticationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalColors.colors.pink10 },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ title: "Welcome" }}
      />
      <Stack.Screen
        name="RegisterIn"
        component={Register}
        options={{ title: "" }}
      />
      <Stack.Screen name="LogIn" component={Login} options={{ title: "" }} />
      <Stack.Screen
        name="HomeScreenUser"
        component={HomeScreenUser}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}
function AuthenticatedDrawerDoctor() {
  const [uncount, setUncount] = useState({});
  const [count, setCount] = useState();
  const authCtx = useContext(AuthContext);
  const [oldCount, setoldCount] = useState(0);

  useEffect(() => {
    async function getUnread() {
      let resp = {};
      resp = await getUnreadMessagesCount(authCtx.uid);

      setUncount(resp);
      setoldCount(resp);
    }

    const interval = setInterval(() => {
      getUnread();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (oldCount !== uncount) {
      let total = Object.values(oldCount).reduce((acc, val) => acc + val, 0);
      setoldCount(uncount);
      setCount(total);
    } else {
      let total = Object.values(oldCount).reduce((acc, val) => acc + val, 0);

      setCount(total);
    }
  }, [uncount]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerLabelStyle: {
          marginLeft: -23,
          fontSize: 15,
          fontFamily: "Garet-Book",
          fontWeight: "bold",
        },
        drawerActiveBackgroundColor: "pink",
        drawerActiveTintColor: "purple",
        drawerInactiveTintColor: GlobalColors.colors.pink500,
        headerTintColor: GlobalColors.colors.pink500,
        headerStyle: { backgroundColor: "transparent" },
      }}
    >
      <Drawer.Screen
        name="DoctorScreen"
        component={DoctorScreen}
        options={{
          title: "Home",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="home-outline" />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="DoctorProfileScreen"
        component={DoctorProfile}
        options={{
          title: "My profile",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="person-outline" />
          ),
          unmountOnBlur: true,
        }}
      />

      <Drawer.Screen
        name="ChatListDoctor"
        component={ChatListDoctor}
        options={{
          title: "Live Chat",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <>
              <Ionicons color={color} size={20} name="chatbubbles-outline" />
              {count > 0 && (
                <View
                  style={{
                    position: "absolute",
                    left: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 9999,

                    height: 20,

                    width: 20,
                    backgroundColor: GlobalColors.colors.pink500,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Garet-Book",
                      color: GlobalColors.colors.gray0,
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </>
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="DoctorEditProfile"
        component={DoctorEditCard}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AppointmentResult"
        component={AppointmentResult}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AnimalPlan"
        component={AnimalPlan}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="DoseCardPlan"
        component={DoseCardPlan}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
}

function AuthenticatedDrawerUser() {
  const [uncount, setUncount] = useState({});
  const [count, setCount] = useState();
  const authCtx = useContext(AuthContext);
  const [oldCount, setoldCount] = useState(0);

  useEffect(() => {
    async function getUnread() {
      let resp = {};
      resp = await getUnreadMessagesCount(authCtx.uid);

      setUncount(resp);
      setoldCount(resp);
    }

    const interval = setInterval(() => {
      getUnread();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (oldCount !== uncount) {
      let total = Object.values(oldCount).reduce((acc, val) => acc + val, 0);
      setoldCount(uncount);
      setCount(total);
    } else {
      let total = Object.values(oldCount).reduce((acc, val) => acc + val, 0);

      setCount(total);
    }
  }, []);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerLabelStyle: {
          marginLeft: -23,
          fontSize: 15,
          fontFamily: "Garet-Book",
          fontWeight: "bold",
        },
        drawerActiveBackgroundColor: "pink",
        drawerActiveTintColor: "purple",
        drawerInactiveTintColor: GlobalColors.colors.pink500,
        headerTintColor: GlobalColors.colors.pink500,
        headerStyle: { backgroundColor: "transparent" },
      }}
    >
      <Drawer.Screen
        name="HomeScreenUser"
        component={HomeScreenUser}
        options={{
          title: "Home",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="home-outline" />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AnimalsScreen"
        component={UserAnimalsScreen}
        options={{
          title: "My Animals",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="paw-outline" />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="ListDoctorsScreen"
        component={ChatScreenList}
        options={{
          title: "Live Chat",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <>
              <Ionicons color={color} size={20} name="chatbubbles-outline" />
              {count > 0 && (
                <View
                  style={{
                    position: "absolute",
                    left: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 9999,

                    height: 20,

                    width: 20,
                    backgroundColor: GlobalColors.colors.pink500,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Garet-Book",
                      color: GlobalColors.colors.gray0,
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </>
          ),
          unmountOnBlur: true,
        }}
      />

      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="UserAppointments"
        component={UserAppointments}
        options={{
          title: "Appointments",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="calendar-outline" />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="PetHotel"
        component={PetHotel}
        options={{
          title: "Pet Hotel",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcon
              color={color}
              size={20}
              name="office-building"
            />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="PetScreen"
        component={PetScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="BookHotel"
        component={BookHotel}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="PayScreen"
        component={PayScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />

      <Drawer.Screen
        name="UserReservations"
        component={UserReservations}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AddPetScreen"
        component={AddPetScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="BookAppointment"
        component={DoctorBookAppointment}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AnimalRecords"
        component={AnimalRecords}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AnimalNotifications"
        component={NotificationsAnimalPage}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AddFilesScreen"
        component={AddFilesScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
}

function NavigationOption() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthenticationStack />}
      {authCtx.isAuthenticated && !authCtx.isDoctor && (
        <AuthenticatedDrawerUser />
      )}
      {authCtx.isAuthenticated && authCtx.isDoctor && (
        <AuthenticatedDrawerDoctor />
      )}
    </NavigationContainer>
  );
}

function Base() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationsAppointment, setNotificationsAppointment] = useState([]);
  const currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  const [actualDate, setActualDate] = useState(new Date(romanianTime));
  const [minutes, setMinutes] = useState(actualDate.getUTCMinutes());
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    }
  }, []);
  useEffect(() => {
    async function haveNotifications() {
      try {
        let resp = [];
        resp = await getUserNotifications(authCtx.uid);
        // console.log(resp, "aloo");
        setNotifications(resp);
        return resp;
      } catch (error) {
        console.log(error);
      }
    }
    async function haveNotificationsForAppointments() {
      try {
        let resp = [];
        resp = await getUserAppointmentsNotifications(authCtx.uid);
        console.log(resp, "ce am primit");
        setNotificationsAppointment(resp);
        return resp;
      } catch (error) {
        console.log(error);
      }
    }
    function updateDate() {
      setActualDate(new Date(romanianTime));
    }

    const interval = setInterval(() => {
      updateDate();
    }, 60000);
    haveNotifications().then((resp) => {
      for (const key in resp) {
        if (resp[key].date.localeCompare(getFormattedDate(actualDate)) === 0) {
          console.log(resp[key].name);

          console.log(resp);
          if (
            resp[key].momentTime.localeCompare("Morning") === 0 &&
            actualDate.getUTCHours() === 7 &&
            actualDate.getUTCMinutes() === 59
          ) {
            console.log("da");
            scheduleNotificationHandler(
              "Reminder! ☕️",
              `Administrate to ${resp[key].name} morning medication`
            );
          }

          if (
            resp[key].momentTime.localeCompare("Lunch") === 0 &&
            actualDate.getUTCHours() === 12 &&
            actualDate.getUTCMinutes() === 59
          ) {
            scheduleNotificationHandler(
              "Reminder!🍴",
              `Administrate to ${resp[key].name} lunch medication`
            );
          }

          console.log(
            actualDate.getUTCHours(),
            actualDate.getUTCMinutes(),
            resp[key].momentTime.localeCompare("Evening")
          );
          if (
            resp[key].momentTime.localeCompare("Evening") === 0 &&
            actualDate.getUTCHours() === 21 &&
            actualDate.getUTCMinutes() === 16
          ) {
            console.log("daadada");
            // scheduleNotificationHandler(
            //   "Reminder!🌛",
            //   `Administrate to ${resp[key].name} evening medication`
            // );
            scheduleNotificationHandler(
              "Reminder!🌛",
              `Administrate to ${resp[key].name} evening medication`
            );
          }
        }
      }

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    });
    haveNotificationsForAppointments().then((resp) => {
      // console.log(resp, "resp");
      for (const key in resp) {
        const dateApp = moment(resp[key].date, "YYYY-MM-DD");
        const actualDateMoment = moment(
          getFormattedDate(actualDate),
          "YYYY-MM-DD"
        );
        // console.log(actualDateMoment, "date");
        const diffInDays = dateApp.diff(actualDateMoment, "days");
        // console.log(diffInDays);
        if (
          diffInDays === 7 ||
          (diffInDays === 1 &&
            actualDate.getUTCHours() === 19 &&
            actualDate.getUTCMinutes() === 30)
        ) {
          if (resp[key].active === true) {
            scheduleNotificationHandler(
              "Reminder! 🕒",
              `You have an appointment for ${resp[key].name} on ${new Date(
                resp[key].date
              ).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`
            );
          } else {
            scheduleNotificationHandler(
              "Reminder! 🕒",
              `Your vet recommends an appointment for ${
                resp[key].name
              } on ${new Date(resp[key].date).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`
            );
          }
        }
      }

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    });

    return () => clearInterval(interval);
  }, [actualDate]);
  const onLayoutRootView = useCallback(async () => {
    if (isTryingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  return <NavigationOption />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />

      <AuthContextProvider>
        <Base />
      </AuthContextProvider>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
