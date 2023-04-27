import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  getDoctorsList,
  getImageUrl,
  getMessagesWithUsers,
  getUserDetails,
  getUsersWithConversations,
} from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../constants/colors";
import { AuthContext } from "../context/auth";
import FeatherIcon from "react-native-vector-icons/Feather";

function ChatListDoctor({ navigation }) {
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
  const [userConv, setUsersConc] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [details, setDetails] = useState([]);
  const [photo, setPhoto] = useState();
  const authCtx = useContext(AuthContext);
  useLayoutEffect(() => {
    async function getUsersConc() {
      try {
        setFetching(true);
        let list = [];
        const detailsList = [];
        list = await getMessagesWithUsers(authCtx.uid);
        for (const key in list) {
          const userDetails = await getUserDetails(list[key].otherUserId);
          console.log(userDetails);
          detailsList.push(userDetails);
        }
        setDetails(detailsList);
        setUsersConc(list);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getUsersConc();
  }, []);
  useEffect(() => {
    async function getUrl() {
      try {
        const url = await getImageUrl(`doctor/${authCtx.uid}`);
        setPhoto(url);
        console.log(photo);
      } catch (error) {
        console.log(error);
      }
    }
    getUrl();
  }, []);
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.docContainer}>
      <Text style={styles.title}>Inbox</Text>

      <FlatList
        data={userConv}
        renderItem={({ item, index }) => (
          <View key={index} style={[styles.card]}>
            <View
              style={[
                styles.cardImg,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  styles.cardEmailText,
                  {
                    marginLeft: 0,
                    fontSize: 18,
                    fontFamily: "Garet-Book",
                    marginBottom: 0,
                  },
                ]}
              >
                {details[index].name[0].toUpperCase()}
              </Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{details[index].name}</Text>

              <View style={styles.cardEmail}>
                <FeatherIcon
                  color={GlobalColors.colors.gray10}
                  name="mail"
                  size={15}
                />

                <Text style={styles.cardEmailText}>{details[index].email}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ChatScreen", {
                  receiverId: item.otherUserId,
                  photo: photo,
                  name: details[index].name,
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
export default ChatListDoctor;
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
    fontSize: 15,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    bottom: 10,
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
    backgroundColor: GlobalColors.colors.pink500,
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
