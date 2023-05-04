import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useContext, useState } from "react";
import { getReservations } from "../store/databases";
import { AuthContext } from "../context/auth";
import { GlobalColors } from "../constants/colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
function UserReservations({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0,
      borderBottomColor: GlobalColors.colors.gray0,
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 20, flexDirection: "row", top: 5 }}
        onPress={() => navigation.navigate("PetHotel")}
      >
        <Feather
          name={"chevron-left"}
          color={GlobalColors.colors.pink500}
          size={15}
          style={{ top: 3, left: 2 }}
        />
        <Text
          style={{
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
            fontSize: 14,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    ),
  });
  const authCtx = useContext(AuthContext);
  const [reservations, setReservations] = useState({});
  useEffect(() => {
    async function getUserReservations() {
      const resp = await getReservations(authCtx.uid);
      setReservations(resp);
      console.log(reservations);
    }
    getUserReservations();
  }, []);
  const renderItem = (item) => {
    const date = `${moment(item.startDate).format("ddd, DD.MM")} ${
      item.endDate ? `- ${moment(item.endDate).format("ddd, DD.MM")}` : ""
    }`;
    return (
      <View style={styles.cardItem}>
        <View
          style={{
            flexDirection: "row",

            marginLeft: 20,
            marginVertical: 8,
          }}
        >
          <Feather
            name="calendar"
            color={GlobalColors.colors.darkGrey}
            size={14}
            style={{ position: "absolute", top: 3, left: 13 }}
          />
          <Text
            style={[
              styles.subtitle,
              {
                color: GlobalColors.colors.pink500,
                textAlign: "center",
              },
            ]}
          >
            {date}
          </Text>
        </View>
        <Text style={[styles.subtitle, { marginHorizontal: 8 }]}>
          Reservation made for {item.animals.length}{" "}
          {item.animals.length === 1 ? `pet` : `pets`}
        </Text>

        <View
          style={{
            flexDirection: "row",

            marginLeft: 20,
            marginVertical: 10,
          }}
        >
          <MaterialCommunityIcon
            name="account-cash"
            style={{ position: "absolute", top: 3, left: 13 }}
            color={GlobalColors.colors.darkGrey}
            size={14}
          />
          <Text style={styles.subtitle}>
            Total payment: {item.payment} lei,{" "}
            {item.pay === "Arrival" ? `at arrival` : ` online`}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 20 }]}>
        Active reservations
      </Text>
      <View>
        <FlatList
          data={reservations.active}
          renderItem={({ item, index }) => renderItem(item)}
        />
      </View>
      <Text style={styles.title}>Past reservations</Text>
      <View>
        <FlatList
          data={reservations.past}
          renderItem={({ item, index }) => renderItem(item)}
        />
      </View>
    </View>
  );
}
export default UserReservations;
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginLeft: 37,

    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  cardItem: {
    backgroundColor: GlobalColors.colors.gray0,
    marginHorizontal: 30,
    marginVertical: 15,
    height: 100,
    borderRadius: 10,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 1,
    shadowOpacity: 0.4,
  },
  subtitle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 14,
    marginLeft: 33,
    marginBottom: 2,
  },
});
