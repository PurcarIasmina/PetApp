import { NavigationContainer } from "@react-navigation/native";
import { Text, SafeAreaView } from "react-native";

import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useContext, useEffect, useCallback } from "react";
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
import { getDoctorsList, getTokens } from "./store/databases";
import NotificationsAnimalPage from "./screens/NotificationsAnimalPage";
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
        name="ChatScreen"
        component={ChatScreen}
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
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received");
        console.log(notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
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
