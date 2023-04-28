import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { GiftedChat, Bubble, Send, Avatar } from "react-native-gifted-chat";
import {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useCallback,
} from "react";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/auth";
import { GlobalColors } from "../constants/colors";
import {
  addMessage,
  addToFiresbaseChatConversation,
  getConversationsByDoctor,
  getDoctorConversationsByName,
  getImageUrl,
  getMessagesFunction,
  getUserName,
  setMessagesRead,
  storeImage,
} from "../store/databases";
import { serverTimestamp } from "firebase/firestore";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

function ChatScreen({ navigation }) {
  const route = useRoute();

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newVal, setNew] = useState(false);
  const authCtx = useContext(AuthContext);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [imagePicked, setImagePicked] = useState(false);
  // useLayoutEffect(() => {
  //   function getMessages() {
  //     try {
  //       let resp = getConversationsByDoctor(
  //         setMessages,
  //         authCtx.uid,
  //         route.params.receiverId
  //       );

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getMessages();

  //   // } else {
  //   //   console.log("da");
  //   //   async function getMessagesByDoc2() {
  //   //     try {
  //   //       let resp = [];
  //   //       resp = await getDoctorConversationsByName(setMessages, authCtx.uid);

  //   //       console.log(resp, "doctor");
  //   //       setIsLoading(false);
  //   //       console.log(messages, "messages");
  //   //     } catch (error) {
  //   //       console.log(error);
  //   //     }
  //   //   }
  //   //   getMessagesByDoc2();
  //   // }
  // }, []);
  function getAllMessages() {
    const chatid =
      route.params.receiverId > authCtx.uid
        ? authCtx.uid + "-" + route.params.receiverId
        : route.params.receiverId + "-" + authCtx.uid;

    getMessagesFunction(chatid)
      .then((msg) => {
        setMessages(msg);
        // console.log(msg);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    async function setRead() {
      await setMessagesRead(authCtx.uid, route.params.receiverId);
    }
    setRead();
  }, [messages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: GlobalColors.colors.pink500,
        borderBottomWidth: 0,
        borderBottomColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
      },
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: GlobalColors.colors.pink500,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(
                authCtx.doctor ? "ChatListDoctor" : "ListDoctorsScreen"
              );
            }}
          >
            <Feather
              name="chevron-left"
              size={20}
              color={GlobalColors.colors.gray0}
              style={{ top: 8 }}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: GlobalColors.colors.gray0,
                left: 8,
              },
            ]}
          >
            <Text
              style={[styles.initials, { color: GlobalColors.colors.pink500 }]}
            >
              {route.params.name[0].toUpperCase()}
            </Text>
          </View>
          <Text
            style={[
              styles.initials,
              {
                color: GlobalColors.colors.gray0,
                top: 8,
                left: 18,
                fontSize: 18,
              },
            ]}
          >
            {route.params.name}
          </Text>
        </View>
      ),
    });
    getAllMessages();
  }, [messages]);
  const galleryPhotoHandler = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.2 });

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setImagePicked(true);
      console.log(result.uri);
    }
  };

  const takePhotoHandler = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.2 });

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setImagePicked(true);
      console.log(result.uri);
    }
  };

  const onSend = useCallback(async (msgArray = []) => {
    const msg = msgArray[0];

    const chatid =
      route.params.receiverId > authCtx.uid
        ? authCtx.uid + "-" + route.params.receiverId
        : route.params.receiverId + "-" + authCtx.uid;
    const url = pickedImagePath ? `${chatid}/${Math.random()}.jpeg` : "";
    if (pickedImagePath) {
      await storeImage(pickedImagePath, url);
    }
    const usermsg = {
      ...msg,
      sentBy: authCtx.uid,
      sentTo: route.params.receiverId,
      createdAt: new Date(),
      read: false,
      image: await getImageUrl(url),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, usermsg)
    );

    await addMessage(chatid, usermsg);
  }, []);
  const renderAvatar = (props) => {
    // if (authCtx.doctor) {
    //   return <Avatar {...props} />;
    // }
    // console.log(route.params.name);
    const initials = route.params.name[0].toUpperCase();

    return (
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
        {/* <Text>{route.params.name}</Text> */}
      </View>
    );
  };
  if (isLoading) {
    return <LoadingOverlay message={"Sending..."} />;
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: authCtx.uid,
          name: route.params.name,
          avatar: "",
        }}
        renderAvatar={renderAvatar}
        renderBubble={(props) => {
          return (
            <View>
              <Bubble
                {...props}
                wrapperStyle={{
                  right: { backgroundColor: GlobalColors.colors.pink500 },
                  left: { backgroundColor: GlobalColors.colors.gray0 },
                }}
              />
            </View>
          );
        }}
        // renderMessageImage={(props) => (
        //   <Image
        //     {...props}
        //     source={{ uri: props.image }}
        //     style={{ width: 200, height: 200 }}
        //   />
        // )}
        alwaysShowSend
        renderSend={(props) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                justifyContent: "center",
              }}
            >
              {pickedImagePath !== "" && (
                <Image
                  source={{ uri: pickedImagePath }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    position: "absolute",
                    left: -40,
                  }}
                />
              )}
              <TouchableOpacity onPress={takePhotoHandler}>
                <MaterialCommunityIcon
                  size={24}
                  color={"#535D63"}
                  name="camera-image"
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={galleryPhotoHandler}>
                <MaterialCommunityIcon
                  size={21}
                  color={"#535D63"}
                  name="file-image-plus-outline"
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
              </TouchableOpacity>

              <Send
                {...props}
                containerStyle={{ justifyContent: "center", marginRight: 17 }}
              >
                <MaterialCommunityIcon
                  size={22}
                  color={"#535D63"}
                  name="send"
                />
              </Send>
            </View>
          );
        }}
      />
    </View>
  );
}
export default ChatScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: GlobalColors.colors.pink500,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    top: -2,
  },
  initials: {
    fontSize: 15,
    fontWeight: "500",
    color: GlobalColors.colors.gray10,

    lineHeight: 20,
  },
});
