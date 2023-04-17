import { View, StyleSheet, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
function MedicalRecordCard({ appointment }) {
  console.log(appointment);
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.diagnostic}>
        {" "}
        {appointment.result.hasOwnProperty("diagnostic")
          ? `Diagnostic: ${appointment.result.diagnostic}`
          : null}
      </Text>
      <Text>
        {appointment.date}, {appointment.slot}
      </Text>
    </View>
  );
}

export default MedicalRecordCard;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    height: 200,
    width: 380,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    padding: 20,
  },
  diagnostic: {
    fontSize: 15,
    color: GlobalColors.colors.darkGrey,
  },
});
