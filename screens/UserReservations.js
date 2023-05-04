import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useContext, useState } from "react";
import { deleteReservation, getReservations } from "../store/databases";
import { AuthContext } from "../context/auth";
import { GlobalColors } from "../constants/colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";
import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "../components/UI/LoadingOverlay";

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
  const [showAlert, setShowAlert] = useState(false);
  const [reservations, setReservations] = useState({});
  const [deleted, setDeleted] = useState(false);
  const [deletedFinished, setDeleteFinished] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    async function getUserReservations() {
      setFetching(true);
      const resp = await getReservations(authCtx.uid);
      setReservations(resp);
      console.log(reservations);
      setFetching(false);
    }
    getUserReservations();
  }, [deletedFinished]);
  console.log(id, "id");
  useEffect(() => {
    async function handlerDeleteReservations() {
      if (deleted === true) {
        try {
          setShowAlert(false);
          const resp = await deleteReservation(id);
          setDeleteFinished(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
    handlerDeleteReservations();
  }, [deleted]);

  const renderItem = (item, active) => {
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

        {active && (
          <>
            <View style={styles.closeCircle}>
              <TouchableOpacity
                onPress={() => {
                  setId(item.generatedId), setShowAlert(true);
                }}
              >
                <Ionicons
                  style={styles.closeCircleElement}
                  size={25}
                  name={"md-close-circle-outline"}
                />
              </TouchableOpacity>
            </View>
            <AwesomeAlert
              show={showAlert}
              title="Are you sure you want to cancel this reservation?"
              titleStyle={{ color: GlobalColors.colors.pink500, fontSize: 18 }}
              showCancelButton={true}
              cancelText="No"
              cancelButtonStyle={{
                backgroundColor: GlobalColors.colors.pastel1,
                width: 80,
                alignItems: "center",
              }}
              cancelButtonTextStyle={{
                fontSize: 19,
                color: GlobalColors.colors.pink10,
              }}
              onCancelPressed={() => {
                setShowAlert(false);
              }}
              showConfirmButton={true}
              confirmText="Yes"
              confirmButtonStyle={{
                backgroundColor: GlobalColors.colors.pink10,
                width: 85,
                alignItems: "center",
              }}
              confirmButtonTextStyle={{
                fontSize: 19,
                color: GlobalColors.colors.pastel1,
              }}
              onConfirmPressed={() => {
                setShowAlert(false), setDeleted(true);
              }}
            />
          </>
        )}
      </View>
    );
  };
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 20 }]}>
        Active reservations
      </Text>
      {reservations &&
        reservations.active &&
        Object.keys(reservations.active).length === 0 && (
          <Text
            style={[styles.title, { fontSize: 14, marginBottom: 40, top: -20 }]}
          >
            No active reservations!
          </Text>
        )}
      <View>
        <FlatList
          data={reservations.active}
          renderItem={({ item, index }) => renderItem(item, true)}
        />
      </View>
      <Text style={[styles.title, { marginBottom: 20 }]}>
        Past reservations
      </Text>
      {reservations &&
        reservations.past &&
        Object.keys(reservations.past).length === 0 && (
          <Text style={[styles.title, { fontSize: 14, top: -20 }]}>
            No past reservations!
          </Text>
        )}
      {reservations.past && (
        <View>
          <FlatList
            data={reservations.past}
            renderItem={({ item, index }) => renderItem(item, false)}
          />
        </View>
      )}
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
  closeCircle: {
    // marginLeft: Dimensions.get("screen").width / 3,
    position: "absolute",
    left: 340,
  },
  closeCircleElement: {
    color: GlobalColors.colors.gray10,
    size: 30,
    top: 0,
    right: 2,
  },
});
