import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Map from "../components/UI/Map";
import { GlobalColors } from "../constants/colors";
import { BlurView } from "expo-blur";
import Feather from "react-native-vector-icons/Feather";
import ButtonCustom from "../components/UI/ButtonCustom";
import { Button } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 20, flexDirection: "row", top: 3 }}
        onPress={() => navigation.navigate("UserReservations")}
      >
        <Text
          style={{
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
            fontSize: 14,
          }}
        >
          Reservations
        </Text>
        <Feather
          name={"chevron-right"}
          color={GlobalColors.colors.pink500}
          size={15}
          style={{ top: 3, left: 2 }}
        />
      </TouchableOpacity>
    ),
  });
  return (
    <View style={{ flex: 1, backgroundColor: GlobalColors.colors.gray0 }}>
      <Image
        style={{ height: 100, width: 140, alignSelf: "center" }}
        source={require("../images/catandpet.png")}
      />
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
        <Text style={styles.descriptionText}>
          {`\t`}Our clinic provides a safe and comfortable home-away-from-home
          for your furry friends while you're away. Our expert staff is
          dedicated to ensuring your pet's health, happiness, and safety. Our
          spacious rooms and play areas are designed to accommodate pets of all
          sizes, and we offer a variety of amenities to keep them entertained,
          including toys, treats, and outdoor areas for exercise. We provide
          nutritious meals and clean bedding, and our trained staff is available
          to administer any necessary medications or treatments. At our pet
          hotel, we treat your pets like family and provide them with the love
          and care they deserve.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={styles.findUsText}>How to find us</Text>
          <Feather
            name="map-pin"
            size={14}
            color={GlobalColors.colors.blue500}
            style={{ top: 35, left: -4 }}
          />
        </View>
        <Map />
        <Button
          labelStyle={{ fontFamily: "Garet-Book" }}
          buttonColor={GlobalColors.colors.pink500}
          textColor="white"
          style={{
            marginTop: 40,
            width: 200,
            justifyContent: "center",
            alignSelf: "center",
            height: 40,
            shadowColor: GlobalColors.colors.gray10,
            shadowOffset: { width: -2, height: -3 },
            shadowRadius: 5,
            shadowOpacity: 0.5,
            elevation: 5,
          }}
          onPress={() => navigation.navigate("BookHotel")}
        >
          Book
        </Button>
      </View>
    </View>
  );
}
export default PetHotel;
const styles = StyleSheet.create({
  title: {
    fontFamily: "Garet-Book",

    color: GlobalColors.colors.blue500,
    marginTop: -10,
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
  descriptionText: {
    fontSize: 12,
    marginTop: 30,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    textAlign: "justify",
    marginHorizontal: 30,
    textIndent: 80,
  },
});
