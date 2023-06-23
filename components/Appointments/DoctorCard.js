import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { GlobalColors } from "../../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { getAgeYear } from "../../util/date";
import { useNavigation } from "@react-navigation/native";
function DoctorCard({ doctor, left }) {
  const navigation = useNavigation();
  const [details, setDetails] = useState({
    fullname: doctor.fullname,
    name: doctor.name.charAt(0).toUpperCase() + doctor.name.slice(1),
    photo: doctor.photo,
    gender: doctor.gender,
    birthday: doctor.datebirth,
    telephone: doctor.telephone,
    description: doctor.description,
    did: doctor.did,
  });
  console.log(doctor.datebirth);

  function pressHandler() {
    navigation.navigate("BookAppointment", { details });
  }
  return (
    <TouchableOpacity
      style={[
        styles.docItem,
        left ? { alignSelf: "flex-start", maxWidth: "45%" } : null,
      ]}
      onPress={pressHandler}
    >
      <Image source={{ uri: details.photo }} style={styles.docImg}></Image>
      <Text style={styles.docName}>Dr. {details.fullname}</Text>
      <View
        style={{ flexDirection: "row", justifyContent: "center", marginTop: 4 }}
      >
        <FontAwesome
          size={13}
          color="gray"
          style={{ top: 2 }}
          name={details.gender === "Female" ? "venus" : "mars"}
        />
        <Text style={styles.age}>{getAgeYear(doctor.datebirth)}y</Text>
      </View>
      <Text style={styles.appointment}>Make an appointment</Text>
    </TouchableOpacity>
  );
}
export default DoctorCard;
const styles = StyleSheet.create({
  docItem: {
    width: "44%",
    height: 200,
    backgroundColor: GlobalColors.colors.gray0,
    borderWidth: 1,
    borderColor: GlobalColors.colors.white1,
    borderRadius: 10,
    marginHorizontal: 11,
    marginRight: 8,
    marginVertical: 10,
    flexGrow: 1,
    shadowColor: GlobalColors.colors.gray10,
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
  },
  docImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  docName: {
    fontSize: 15,
    fontFamily: "Garet-Book",
    alignSelf: "center",
    marginTop: 10,
    color: GlobalColors.colors.pink500,
  },
  appointment: {
    color: GlobalColors.colors.mint1,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  age: {
    paddingHorizontal: 4,
    size: 15,
    color: "gray",
  },
});
