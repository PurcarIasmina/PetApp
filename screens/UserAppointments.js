import { View, Text, StyleSheet, FlatList } from "react-native";
import HeaderButtonAppointment from "../components/UI/HeaderButtonAppointment";
import { useState, useContext, useLayoutEffect } from "react";
import { TouchableRipple } from "react-native-paper";
import { getUserStatusAppointments } from "../store/databases";
import { AuthContext } from "../context/auth";
import AppointmentStatus from "../components/Appointments/AppointmentStatus";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/colors";
import LoadingOverlay from "../components/UI/LoadingOverlay";
function UserAppointments() {
  const [status, setStatus] = useState(0);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    setFetching(true);
    async function getActiveAppointments() {
      try {
        setFetching(true);
        const active = await getUserStatusAppointments(authCtx.uid, 0);
        setActiveAppointments(active);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(authCtx.uid);
    async function getPastAppointments() {
      try {
        setFetching(true);
        const past = await getUserStatusAppointments(authCtx.uid, 1);
        setPastAppointments(past);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    async function getCanceledAppointments() {
      try {
        setFetching(true);
        const canceled = await getUserStatusAppointments(authCtx.uid, 2);
        setCanceledAppointments(canceled);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getActiveAppointments();
    getPastAppointments();
    getCanceledAppointments();
    setFetching(false);
  }, [status]);
  function handlerOnPress() {
    setStatus(2);
  }
  if (fetching) return <LoadingOverlay message={"Loading"} />;
  return (
    <View>
      <View style={styles.headerButtons}>
        <TouchableRipple onPress={() => setStatus(0)}>
          <HeaderButtonAppointment
            pressed={status === 0 ? "pressed" : null}
            status={"Active"}
            count={activeAppointments.length}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setStatus(1);
          }}
        >
          <HeaderButtonAppointment
            pressed={status === 1 ? "pressed" : null}
            status={"Past"}
            count={pastAppointments.length}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setStatus(2);
          }}
        >
          <HeaderButtonAppointment
            pressed={status === 2 ? "pressed" : null}
            status={"Canceled"}
            count={canceledAppointments.length}
          />
        </TouchableRipple>
      </View>
      {((status === 0 && activeAppointments.length === 0) ||
        (status === 1 && pastAppointments.length === 0) ||
        (canceledAppointments.length === 0 && status === 2)) && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 280,
          }}
        >
          <Ionicons
            name={"calendar-outline"}
            color={GlobalColors.colors.gray10}
            size={40}
          />
          <Text
            style={{
              fontWeight: "600",
              fontSize: 20,
              color: GlobalColors.colors.gray10,
              marginRight: 3,
            }}
          >
            No Appointments
          </Text>
        </View>
      )}
      <FlatList
        data={
          status === 0
            ? activeAppointments
            : status === 1
            ? pastAppointments
            : canceledAppointments
        }
        renderItem={({ item, index }) => (
          <AppointmentStatus
            status={status}
            appointment={item}
            onPress={handlerOnPress}
          />
        )}
        keyExtractor={(item) => item.generatedId}
      ></FlatList>
    </View>
  );
}
export default UserAppointments;
const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
  },
});
