import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
function CreateProfileReminder() {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.itemsView}>
        <View style={styles.personIconView}>
          <Ionicons
            name={"person-sharp"}
            color={GlobalColors.colors.darkGrey}
            size={48}
          />
        </View>
        <View style={styles.appDetails}>
          <Text style={styles.textStyle}>Create your profile</Text>
        </View>
        <Feather
          name="arrow-right-circle"
          size={18}
          color={GlobalColors.colors.darkGrey}
          style={styles.icon}
          onPress={() => {
            navigation.navigate("DoctorProfileScreen");
          }}
        />
      </View>
    </View>
  );
}
export default CreateProfileReminder;
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
    marginBottom: 40,
  },
  itemsView: { flexDirection: "row", alignItems: "center" },
  appDetails: {
    marginHorizontal: 30,
  },
  textStyle: {
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
    fontSize: 18,
  },

  personIconView: {
    backgroundColor: GlobalColors.colors.gray1,
    borderRadius: 140,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  icon: { left: -20 },
});
