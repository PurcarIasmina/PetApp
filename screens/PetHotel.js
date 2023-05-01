import { View, Text, StyleSheet } from "react-native";
import Map from "../components/UI/Map";
import { GlobalColors } from "../constants/colors";
import { BlurView } from "expo-blur";
import Feather from "react-native-vector-icons/Feather";

function PetHotel({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: GlobalColors.colors.gray0,
      borderBottomWidth: 0,
      borderBottomColor: GlobalColors.colors.gray0,
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: GlobalColors.colors.gray0 }}>
      <Text style={styles.title}>We are here to take care of your pets!</Text>
      <View
        style={{
          top: 40,
          borderRadius: 50,
          padding: 10,
          borderColor: GlobalColors.colors.blue500,
          flex: 1,
          backgroundColor: "#F8F4EA",
          shadowColor: GlobalColors.colors.gray10,
          shadowOffset: { width: -2, height: -3 },
          shadowRadius: 5,
          shadowOpacity: 0.5,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={styles.findUsText}>How to find us</Text>
          <Feather
            name="map-pin"
            size={14}
            color={GlobalColors.colors.blue500}
            style={{ top: 35, left: -4 }}
          />
        </View>
        <Map />
      </View>
    </View>
  );
}
export default PetHotel;
const styles = StyleSheet.create({
  title: {
    fontFamily: "Garet-Book",

    color: GlobalColors.colors.blue500,
    marginTop: 30,
    fontSize: 18,
    marginHorizontal: 40,
    textAlign: "center",
  },
  findUsText: {
    marginBottom: 20,
    marginTop: 30,
    fontFamily: "Garet-Book",
    fontSize: 16,
    left: -10,
    color: GlobalColors.colors.pink500,
  },
});
