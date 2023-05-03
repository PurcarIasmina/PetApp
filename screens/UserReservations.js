import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useContext, useState } from "react";
import { getReservations } from "../store/databases";
import { AuthContext } from "../context/auth";
import { GlobalColors } from "../constants/colors";
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
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active reservations</Text>
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
});
