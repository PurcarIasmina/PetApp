import { View, Image, StyleSheet, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { getAge, getRomanianTime } from "../../util/date";
import { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
function AppointmentCard({ appointment }) {
  const actualTime = getRomanianTime().toISOString().slice(11, 16);
  const actualDate = getRomanianTime().toISOString().slice(0, 10);
  const navigation = useNavigation();
  console.log(appointment);
  useEffect(() => {}, []);
  return (
    <View>
      <View style={styles.elementContainer}>
        <View
          style={{
            maxHeight: 100,
            overflow: "hidden",
            borderRadius: 30,
            alignSelf: "center",
          }}
        >
          <Image style={styles.image} source={{ uri: appointment.photoUrl }} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{appointment.animal.nameA}</Text>
          <Text style={[styles.name, { fontSize: 13 }]}>
            Owner: {appointment.ownername}
          </Text>
          <Text style={styles.date}>{`${
            getAge(appointment.animal.date).years
          }y ${getAge(appointment.animal.date).months}m ${
            getAge(appointment.animal.date).days
          }d`}</Text>
          <Text
            style={[
              styles.date,
              { color: GlobalColors.colors.mint1, marginTop: 3 },
            ]}
          >
            Reason: {appointment.reason}
          </Text>
          <Text
            style={[
              styles.date,
              { color: GlobalColors.colors.mint1, marginTop: 2 },
            ]}
          >
            {appointment.date} {appointment.slot}
          </Text>
          {(actualDate > appointment.date ||
            (actualDate === appointment.date &&
              actualTime > appointment.slot)) && (
            <View style={styles.uploadContainer}>
              {!appointment.hasOwnProperty("done") && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AppointmentResult", {
                      appointment: appointment,
                    })
                  }
                >
                  <FontAwesome
                    color={GlobalColors.colors.pink500}
                    name={"upload"}
                    size={20}
                  />
                </TouchableOpacity>
              )}
              {appointment.hasOwnProperty("done") && (
                <MaterialCommunityIcon
                  color={GlobalColors.colors.pink500}
                  name={"archive-check-outline"}
                  size={20}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
export default AppointmentCard;
const styles = StyleSheet.create({
  elementContainer: {
    backgroundColor: GlobalColors.colors.white1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 30,
    height: 140,
    width: 350,
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginHorizontal: 15,
    alignSelf: "center",
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: GlobalColors.colors.white1,
    marginHorizontal: 20,
    marginTop: 10,
  },
  name: {
    fontSize: 20,

    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    fontFamily: "Roboto-Regular",
    marginBottom: 5,
    left: -10,
  },
  date: {
    fontSize: 16,
    color: GlobalColors.colors.gray10,
    fontFamily: "Garet-Book",
  },
  uploadContainer: {
    position: "absolute",
    top: -2,
    alignSelf: "flex-end",
    right: -2,
  },
});
