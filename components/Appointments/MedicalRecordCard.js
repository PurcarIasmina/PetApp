import { View, StyleSheet, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { getDoctorDetails, getUserName } from "../../store/databases";
import LoadingOverlay from "../UI/LoadingOverlay";
import { ScrollView } from "react-native-gesture-handler";

function formatDate(dateString) {
  if (dateString) {
    const dateObj = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  } else return "";
}
function MedicalRecordCard({ appointment, status }) {
  //   console.log(appointment);
  const [docName, setName] = useState("");
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    async function getDocNm() {
      try {
        setFetching(true);
        const resp = await getUserName(appointment.did);
        console.log(resp);
        setName(resp);
        console.log(docName);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getDocNm();
  }, []);
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.cardContainer}>
      <View style={{ flexDirection: "column" }}>
        <View style={styles.shortDate}>
          <Text style={styles.textDate}>{formatDate(appointment.date)}</Text>
        </View>

        <View style={styles.dateContainer}>
          <MaterialCommunityIcon
            name="clock-outline"
            size={15.5}
            color={GlobalColors.colors.pink500}
            style={{ paddingHorizontal: 8, top: 1.5, marginRight: 6 }}
          />
          <Text style={styles.diagnostic}>{appointment.slot}</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, left: -5 }}>
          <Icon
            name="user-md"
            size={15.5}
            color={GlobalColors.colors.pink500}
            style={{ marginTop: 2, paddingHorizontal: 7, marginRight: 8 }}
          />
          <Text style={[styles.diagnostic, { fontSize: 16 }]}>{docName}</Text>
        </View>
        {appointment.result.nextAppointment.length > 0 && (
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Icon
              name="arrow-right"
              size={11}
              color={GlobalColors.colors.pink500}
              style={{ marginTop: 5, left: 12 }}
            />
            <Icon
              name="calendar"
              size={13.5}
              color={GlobalColors.colors.pink500}
              style={{
                marginTop: 2,
                paddingRight: 7,

                left: -8,
              }}
            />
            <Text style={[styles.diagnostic, { fontSize: 16 }]}>
              {formatDate(appointment.result.nextAppointment)}
            </Text>
          </View>
        )}
      </View>
      <View style={{ marginTop: 25, left: 30 }}>
        <View style={{ alignItems: "center", marginLeft: 20 }}>
          {appointment.result.diagnostic && (
            <Text style={[styles.diagnostic, { marginLeft: -20, bottom: 10 }]}>
              Diagnostic: {appointment.result.diagnostic}
            </Text>
          )}
          {appointment.result.doctorReason.localeCompare("Vaccine") === 0 && (
            <View style={{ flexDirection: "row", left: -20, bottom: 10 }}>
              <Text style={styles.diagnostic}>Vaccine Plan</Text>
              <MaterialCommunityIcon
                name={"pill"}
                size={15}
                color={GlobalColors.colors.pink500}
                style={{ paddingHorizontal: 5, top: 1 }}
              />
            </View>
          )}
          {appointment.result.doctorReason.localeCompare("Disinfestation") ===
            0 && (
            <View style={{ flexDirection: "row", left: -20, bottom: 10 }}>
              <Text style={styles.diagnostic}>Disinfestation Plan</Text>
              <MaterialCommunityIcon
                name={"pill"}
                size={15}
                color={GlobalColors.colors.pink500}
                style={{ paddingHorizontal: 5, top: 1 }}
              />
            </View>
          )}
          <ScrollView style={{ left: -15 }}>
            {appointment.result.pillsPlan && (
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.diagnostic}>Medicine Plan</Text>
                  <MaterialCommunityIcon
                    name={"pill"}
                    size={15}
                    color={GlobalColors.colors.pink500}
                    style={{ paddingHorizontal: 5, top: 1 }}
                  />
                </View>
                {appointment.result.doctorReason.localeCompare(
                  "Consultation"
                ) === 0 &&
                  appointment.result.pillsPlan.map((pill, index) => (
                    <View key={index} style={styles.pillContainer}>
                      <Text style={styles.medicineText}>
                        {pill.pillCount} x {pill.pillName}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.diagnostic}>When:</Text>
                        {pill.pillMomentDay.Morning && (
                          <MaterialCommunityIcon
                            name="coffee"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                        {pill.pillMomentDay.Lunch && (
                          <MaterialCommunityIcon
                            name="food-variant"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                        {pill.pillMomentDay.Evening && (
                          <MaterialCommunityIcon
                            name="bed-empty"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                      </View>
                      <Text style={styles.diagnostic}>
                        How long : {pill.pillTimes} days
                      </Text>
                    </View>
                  ))}
              </View>
            )}
            {appointment.result.doctorReason.localeCompare("Consultation") !=
              0 &&
              appointment.result.appointmentDoses.map((dose, index) => (
                <View key={index} style={styles.pillContainer}>
                  <Text style={styles.medicineText}>
                    {dose.doseName} x {dose.doseQuantity} dose
                  </Text>
                  <Text style={styles.diagnostic}>Lot: {dose.doseNumber}</Text>
                  {dose.additionalInfo.length > 0 && (
                    <Text style={styles.diagnostic}>
                      Additional Info: {dose.additionalInfo}
                    </Text>
                  )}
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default MedicalRecordCard;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    height: 250,
    width: 380,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    padding: 20,
    flexDirection: "row",
  },
  diagnostic: {
    fontSize: 15,
    color: GlobalColors.colors.darkGrey,
  },
  dateContainer: {
    flexDirection: "row",
    top: 15,
    left: -8,
  },
  shortDate: {
    backgroundColor: GlobalColors.colors.pink500,
    height: 80,
    width: 80,
    borderRadius: 40,

    marginVertical: 5,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  textDate: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.gray0,
    fontSize: 16,
    textAlign: "center",
  },
  medicineText: {
    fontSize: 15,
    color: GlobalColors.colors.pink500,
  },
  iconMoment: {
    paddingHorizontal: 5,
  },
  pillContainer: {
    marginVertical: 3,
  },
});
