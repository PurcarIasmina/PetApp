import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { StylePropType } from "react-native-gifted-chat";
import { GlobalColors } from "../../constants/colors";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
function NotCompletedResultCard({ appointment }) {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.itemsView}>
        <View style={styles.bellView}>
          <Ionicons
            name={"notifications"}
            color={GlobalColors.colors.darkGrey}
            size={60}
          />
        </View>
        <View style={styles.appDetails}>
          <Text style={styles.textStyle}>
            <Text style={styles.infoStyle}>Name:</Text>{" "}
            {appointment.animal.nameA}
          </Text>

          <Text style={styles.textStyle}>
            <Text style={styles.infoStyle}>Reason:</Text> {appointment.reason}
          </Text>
          <Text style={styles.textStyle}>
            <Text style={styles.infoStyle}>Date:</Text> {appointment.date},{" "}
            {appointment.slot}
          </Text>
        </View>
        <Feather
          name="upload"
          onPress={() =>
            navigation.navigate("AppointmentResult", {
              appointment: appointment,
              reminder: true,
            })
          }
          size={16}
          color={GlobalColors.colors.darkGrey}
          style={styles.icon}
        />
      </View>
    </View>
  );
}
export default NotCompletedResultCard;
const styles = StyleSheet.create({
  card: {
    height: 80,
    backgroundColor: GlobalColors.colors.gray0,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
    borderColor: GlobalColors.colors.gray10,
    borderWidth: 0.3,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  itemsView: { flexDirection: "row", alignItems: "center" },
  appDetails: {
    marginHorizontal: 30,
  },
  textStyle: {
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
  },
  infoStyle: {
    color: GlobalColors.colors.darkGrey,
    fontFamily: "Garet-Book",
  },
  bellView: {
    backgroundColor: GlobalColors.colors.gray1,
    borderRadius: 140,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { bottom: 28, left: 6 },
});
