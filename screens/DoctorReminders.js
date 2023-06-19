import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import {
  getDoctorDetails,
  getNotCompletedAppointments,
} from "../store/databases";
import { AuthContext } from "../context/auth";
import NotCompletedResultCard from "../components/Appointments/NotCompletedResultCard";
import { GlobalColors } from "../constants/colors";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import CreateProfileReminder from "../components/Appointments/CreateProfileReminder";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

function DoctorReminders({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [details, setDetails] = useState({});
  const [notCompleted, setNotCompleted] = useState();
  const [fetching, setFetching] = useState(false);
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerBackground: () => (
      <BlurView tint={"dark"} intensity={10} style={StyleSheet.absoluteFill} />
    ),
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          right: 112,
        }}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: 22,
              color: GlobalColors.colors.pink500,

              marginBottom: 0,
            },
          ]}
        >
          Your reminders
        </Text>
        <Ionicons
          name="notifications"
          color={GlobalColors.colors.darkGrey}
          size={18}
          style={styles.bellIcon}
        />
      </View>
    ),
  });
  useEffect(() => {
    async function getUndoneApp() {
      setFetching(true);
      let resp = [];
      resp = await getNotCompletedAppointments(authCtx.uid);
      setAppointments(resp);
      setFetching(false);
    }
    getUndoneApp();
  }, []);
  useEffect(() => {
    async function getDocDetails() {
      setFetching(true);

      const resp = await getDoctorDetails(authCtx.uid);
      if (resp) setDetails(resp);
      else {
        setNotCompleted(true);
      }
      console.log(resp, "resp");
      setFetching(false);
    }
    getDocDetails();
  }, []);
  if (fetching) return <LoadingOverlay message="Loading..." />;
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 130 }}>
        {notCompleted && (
          <>
            <Text style={styles.title}>Create your profile!</Text>
            <CreateProfileReminder />
          </>
        )}

        {appointments.length > 0 && (
          <>
            <Text style={styles.title}>Upload consultations results!</Text>

            <FlatList
              data={appointments}
              renderItem={({ item, index }) => (
                <NotCompletedResultCard appointment={item} />
              )}
              keyExtractor={(item) => item.generatedId}
            />
          </>
        )}
        {!notCompleted && appointments.length == 0 && (
          <View style={{ alignSelf: "center", top: 200 }}>
            <Ionicons
              name="notifications-off-circle"
              size={80}
              color={GlobalColors.colors.gray10}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.title, { marginLeft: 0 }]}>No reminders!</Text>
          </View>
        )}
      </View>
    </View>
  );
}
export default DoctorReminders;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginLeft: 20,
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 18,
    marginLeft: 20,
    marginBottom: 5,
  },
  bellIcon: {
    top: 7,
    left: 5,
  },
});
