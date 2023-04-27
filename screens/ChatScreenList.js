import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import { getDoctorsList } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../constants/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
function ChatScreenList({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: GlobalColors.colors.gray0,
      borderBottomWidth: 0,
      borderBottomColor: "white",
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
  });
  const [doctors, setDoctors] = useState([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    async function getDoctors() {
      try {
        setFetching(true);
        let doctorsAux = [];
        doctorsAux = await getDoctorsList();
        setDoctors(doctorsAux);
        console.log(doctors);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getDoctors();
  }, []);
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.docContainer}>
      <Text style={styles.title}>Start a live chat with your vet!</Text>
      <FlatList
        data={doctors}
        renderItem={({ item, index }) => (
          <View key={index} style={[styles.card]}>
            <Image
              alt=""
              resizeMode="cover"
              source={{ uri: item.photo }}
              style={styles.cardImg}
            />

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.fullname}</Text>

              <View style={styles.cardEmail}>
                <FeatherIcon
                  color={GlobalColors.colors.gray10}
                  name="mail"
                  size={15}
                />

                <Text style={styles.cardEmailText}>{item.email}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ChatScreen", {
                  receiverId: item.did,
                  name: item.name,
                });
              }}
              style={styles.cardAction}
            >
              <FeatherIcon
                color={GlobalColors.colors.gray10}
                name="send"
                size={20}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.did}

        // contentContainerStyle={styles.list}
      />
    </View>
  );
}
export default ChatScreenList;
const styles = StyleSheet.create({
  cardContainer: {
    height: 100,
    marginHorizontal: 20,
    backgroundColor: GlobalColors.colors.gray0,
    marginVertical: 20,
    borderRadius: 40,
    shadowColor: GlobalColors.colors.gray10,
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 1,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  docContainer: {
    // justifyContent: "center",
    flex: 1,
    backgroundColor: GlobalColors.colors.gray0,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
  },
  imageContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: GlobalColors.colors.pink500,
    marginBottom: 12,
    marginLeft: 8,
    top: 8,
    bottom: 26,
  },
  card: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // borderWidth: 0.5,
    borderRadius: 20,
    padding: 10,
    borderColor: GlobalColors.colors.gray10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  cardImg: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  cardBody: {
    marginRight: "auto",
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "200",
    color: GlobalColors.colors.pink500,
  },
  cardEmail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  cardEmailText: {
    fontSize: 15,
    fontWeight: "500",
    color: GlobalColors.colors.gray10,
    marginLeft: 4,
    lineHeight: 20,
    marginBottom: 2,
  },
  cardAction: {
    height: 40,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
