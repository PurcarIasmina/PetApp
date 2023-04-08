import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import HeaderButtonAppointment from "../components/UI/HeaderButtonAppointment";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { TouchableRipple } from "react-native-paper";
import { getUserStatusAppointments } from "../store/databases";

import { AuthContext } from "../context/auth";
function UserAppointments() {
  const [status, setStatus] = useState(0);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);

  console.log(status);
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    async function getActiveAppointments() {
      try {
        setFet;
        const active = await getUserStatusAppointments(authCtx.uid, 0);
        setActiveAppointments(active);
      } catch (error) {
        console.log(error);
      }
    }
    async function getPastAppointments() {
      try {
        const past = await getUserStatusAppointments(authCtx.uid, 1);
        setPastAppointments(past);
      } catch (error) {
        console.log(error);
      }
    }
    async function getCanceledAppointments() {
      try {
        const canceled = await getUserStatusAppointments(authCtx.uid, 3);
        setCanceledAppointments(canceled);
      } catch (error) {
        console.log(error);
      }
    }
    getActiveAppointments();
    getPastAppointments();
    getCanceledAppointments();
  }, [status]);
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
    </View>
  );
}
export default UserAppointments;
const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
  },
});
