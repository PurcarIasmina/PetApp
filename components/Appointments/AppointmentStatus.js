import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { GlobalColors } from "../../constants/colors";
import {
  cancelAppointment,
  getAnimalDetails,
  getDoctorDetails,
  getUserName,
} from "../../store/databases";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import { useNavigation } from "@react-navigation/native";
function AppointmentStatus({ appointment, status, onPress }) {
  const navigation = useNavigation();
  const [docName, setDocname] = useState("");
  const [animalName, setAnimalName] = useState();
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    async function getAnimalName() {
      try {
        const animal = await getAnimalDetails(appointment.animal.aid);

        setAnimalName(animal.nameA);
      } catch (error) {
        console.log(error);
      }
    }
    async function getDocName() {
      try {
        const doctor = await getUserName(appointment.did);
        setDocname(doctor);
      } catch (error) {
        console.log(error);
      }
    }
    getAnimalName();
    getDocName();
  });
  async function handlerDeleteAppointment() {
    setShowAlert(false);
    try {
      console.log(appointment.generatedId);
      const resp = await cancelAppointment(appointment.generatedId, {
        aid: appointment.animal.aid,
        did: appointment.did,
        canceled: 1,
        date: appointment.date,
        ownername: appointment.ownername,
        reason: appointment.reason,
        slot: appointment.slot,
        uid: appointment.uid,
      });
      onPress();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dateContainer,
          status === 0 && {
            backgroundColor: GlobalColors.colors.green1,
            borderColor: GlobalColors.colors.green10,
            borderWidth: 0.5,
          },
          status === 1 && {
            backgroundColor: GlobalColors.colors.purple10,
            borderColor: GlobalColors.colors.purple300,
            borderWidth: 0.5,
          },
          status === 2 && {
            backgroundColor: GlobalColors.colors.red1,
            borderColor: GlobalColors.colors.red10,
            borderWidth: 0.5,
          },
        ]}
      >
        <Text style={styles.dateStyle}>
          {new Date(appointment.date).toDateString()}
        </Text>
      </View>
      <View style={{ justifyContent: "center", marginLeft: 20 }}>
        <Text style={styles.slotStyle}>{appointment.slot}</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name={"md-checkmark-circle-sharp"}
            size={14}
            color={GlobalColors.colors.pink500}
            style={{ marginRight: 3, top: 4 }}
          />
          <Text style={styles.nameStyle}> {appointment.reason}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon
            name="paw"
            size={14}
            color={GlobalColors.colors.pink500}
            style={{ marginRight: 3, top: 3 }}
          />
          <Text style={styles.nameStyle}> {animalName}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon
            name="user-md"
            size={14}
            color={GlobalColors.colors.pink500}
            style={{ marginRight: 3, top: 3 }}
          />
          <Text style={styles.nameStyle}> {docName}</Text>
        </View>
      </View>
      {status === 0 && (
        <View style={styles.closeCircle}>
          <TouchableOpacity onPress={() => setShowAlert(true)}>
            <Ionicons
              style={styles.closeCircleElement}
              size={30}
              name={"md-close-circle-outline"}
            />
          </TouchableOpacity>
        </View>
      )}
      <AwesomeAlert
        show={showAlert}
        title="Are you sure you want to cancel this appointment?"
        titleStyle={{ color: GlobalColors.colors.pink500, fontSize: 18 }}
        showCancelButton={true}
        cancelText="No"
        cancelButtonStyle={{
          backgroundColor: GlobalColors.colors.pastel1,
          width: 80,
          alignItems: "center",
        }}
        cancelButtonTextStyle={{
          fontSize: 19,
          color: GlobalColors.colors.pink10,
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        showConfirmButton={true}
        confirmText="Yes"
        confirmButtonStyle={{
          backgroundColor: GlobalColors.colors.pink10,
          width: 85,
          alignItems: "center",
        }}
        confirmButtonTextStyle={{
          fontSize: 19,
          color: GlobalColors.colors.pastel1,
        }}
        onConfirmPressed={handlerDeleteAppointment}
      />
    </View>
  );
}
export default AppointmentStatus;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 250,
    borderBottomWidth: 0.9,
    borderBottomColor: GlobalColors.colors.gray1,
  },
  dateContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginVertical: 10,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  dateStyle: {
    color: "white",
    fontFamily: "Garet-Book",
    fontSize: 18,
    padding: 3,
  },
  nameStyle: {
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
    fontSize: 15,
  },

  slotStyle: {
    color: GlobalColors.colors.blue500,
    fontFamily: "Garet-Book",
    fontSize: 18,
    marginBottom: 7,
  },
  closeCircle: {
    // marginLeft: Dimensions.get("screen").width / 3,
    position: "absolute",
    left: 400,
  },
  closeCircleElement: {
    color: GlobalColors.colors.pink500,
    size: 30,
    top: 5,
    right: 10,
  },
});
