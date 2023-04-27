import { NavigationContainer } from "@react-navigation/native";
import { Text, SafeAreaView } from "react-native";

import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useContext, useEffect, useCallback, useRef } from "react";
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
} from "./store/databases";
import NotificationsAnimalPage from "./screens/NotificationsAnimalPage";
import { getFormattedDate } from "./util/date";
import * as TaskManager from "expo-task-manager";
import moment from "moment";
import ChatScreenList from "./screens/ChatScreenList";
import ChatListDoctor from "./screens/ChatListDoctor";
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
            <Ionicons color={color} size={20} name="chatbubbles-outline" />
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
            <Ionicons color={color} size={20} name="chatbubbles-outline" />
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
        name="PetScreen"
        component={PetScreen}
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
          console.log(actualDate.getUTCHours());
          if (
            resp[key].momentTime.localeCompare("Morning") === 0 &&
            actualDate.getUTCHours() === 7 &&
            actualDate.getUTCMinutes() === 59
          ) {
            console.log("da");
            sendPushNotificationHandler(
              authCtx.tokenNotify,
              "Reminder! ☕️",
              `Administrate to ${resp[key].name} morning medication`
            );
          }

          if (
            resp[key].momentTime.localeCompare("Lunch") === 0 &&
            actualDate.getUTCHours() === 12 &&
            actualDate.getUTCMinutes() === 59
          ) {
            sendPushNotificationHandler(
              authCtx.tokenNotify,
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
            actualDate.getUTCHours() === 19 &&
            actualDate.getUTCMinutes() === 59
          ) {
            console.log("da");
            sendPushNotificationHandler(
              authCtx.tokenNotify,
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
          (diffInDays === 1 && actualDate.getUTCHours() === 19)
        ) {
          if (resp[key].active === true) {
            sendPushNotificationHandler(
              authCtx.tokenNotify,
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
            sendPushNotificationHandler(
              authCtx.tokenNotify,
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
