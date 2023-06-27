import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  useState,
  useContext,
  useEffect,
  useCallback,
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
import { startMessageListener } from "./store/databases";
import NotificationsAnimalPage from "./screens/NotificationsAnimalPage";
import ChatScreenList from "./screens/ChatScreenList";
import ChatListDoctor from "./screens/ChatListDoctor";
import AddFilesScreen from "./screens/AddFilesScreen";
import PetHotel from "./screens/PetHotel";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import BookHotel from "./screens/BookHotel";
import PayScreen from "./screens/PayScreen";
import UserReservations from "./screens/UserReservations";
import { LogBox } from "react-native";
import DoctorReminders from "./screens/DoctorReminders";
import DoctorHistory from "./screens/DoctorHistory";

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
  const [count, setCount] = useState(0);
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleUnreadMessagesCount(val) {
      setCount(val);
    }

    startMessageListener(authCtx.uid, handleUnreadMessagesCount);
  }, [open]);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} setOpen={setOpen} />}
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
        name="DoctorReminders"
        component={DoctorReminders}
        options={{
          title: "Reminders",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name={"notifications-outline"} />
          ),
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="DoctorHistory"
        component={DoctorHistory}
        options={{
          title: "Appointments",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Ionicons color={color} size={20} name={"documents-outline"} />
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
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    function handleUnreadMessagesCount(val) {
      setCount(val);
    }

    startMessageListener(authCtx.uid, handleUnreadMessagesCount);
  }, [open]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} setOpen={setOpen} />}
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

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    }
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
