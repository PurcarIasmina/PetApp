import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  Composer,
  Day,
} from "react-native-gifted-chat";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/auth";
import { GlobalColors } from "../constants/colors";
import {
  addMessage,
  getMessagesFunction,
  setMessagesRead,
  storeAndGetUrl,
} from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
function ChatScreen({ navigation }) {
  const route = useRoute();

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newVal, setNew] = useState(false);
  const authCtx = useContext(AuthContext);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [imagePicked, setImagePicked] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [auxImage, setAuxImage] = useState("");

  const chatid =
    route.params.receiverId > authCtx.uid
      ? authCtx.uid + "-" + route.params.receiverId
      : route.params.receiverId + "-" + authCtx.uid;
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerBackground: () => (
      <BlurView tint={"dark"} intensity={20} style={StyleSheet.absoluteFill} />
    ),
    headerStyle: {
      borderBottomWidth: 0,
      borderBottomColor: "white",
      elevation: 0,

      shadowOpacity: 1,
    },
    headerLeft: () => (
      <View
        style={{
          flexDirection: "row",
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
            color={GlobalColors.colors.pink500}
            style={{ top: 8 }}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: GlobalColors.colors.pink500,
              left: 8,
            },
          ]}
        >
          <Text style={[styles.initials, { color: GlobalColors.colors.gray0 }]}>
            {route.params.name[0].toUpperCase()}
          </Text>
        </View>
        <Text
          style={[
            styles.initials,
            {
              color: GlobalColors.colors.pink500,
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

  function getAllMessages() {
    getMessagesFunction(chatid)
      .then((msg) => {
        setMessages(msg);
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
    console.log(messages);
    setRead();
  }, [messages]);

  useLayoutEffect(() => {
    setPickedImagePath("");
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
      setAuxImage(result.uri);
      uploadImage(result.uri);
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
      setAuxImage(result.uri);
      setImagePicked(true);
      uploadImage(result.uri);
      console.log(result.uri);
    }
  };

  const uploadImage = async (imgPath) => {
    const url = `${chatid}/${Math.random()}.jpeg`;
    const res = await storeAndGetUrl(imgPath, url);
    setUrlImage(res);
  };
  const onSend = async (msgArray) => {
    const msg = msgArray[0];
    const usermsg = {
      ...msg,
      sentBy: authCtx.uid,
      sentTo: route.params.receiverId,
      createdAt: new Date(),
      read: false,
      image: urlImage,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, usermsg)
    );
    setAuxImage("");
    setUrlImage("");
    await addMessage(chatid, usermsg);
  };
  const renderAvatar = (props) => {
    const initials = route.params.name[0].toUpperCase();

    return (
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
  };
  if (isLoading) {
    return <LoadingOverlay message={"Sending..."} />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/background2.jpg")}
        style={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: authCtx.uid,
            name: route.params.name,
            avatar: "",
          }}
          keyboardShouldPersistTaps={"always"}
          keyboardDismissMode="on-drag"
          renderChatFooter={() => <View style={{ height: 45 }}></View>}
          renderAvatar={renderAvatar}
          renderDay={(props) => {
            return (
              <Day
                {...props}
                textStyle={{ color: GlobalColors.colors.pink500 }}
              />
            );
          }}
          renderComposer={(props) => (
            <Composer
              {...props}
              composerHeight={80}
              placeholderTextColor={GlobalColors.colors.pink500}
              placeholder=""
              textInputStyle={{
                color: GlobalColors.colors.pink500,
              }}
            />
          )}
          renderBubble={(props) => {
            return (
              <View>
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: {
                      backgroundColor: GlobalColors.colors.pink500,
                      shadowColor: "#333333",
                      shadowOffset: { width: -2, height: 3 },
                      shadowRadius: 1,
                      shadowOpacity: 0.3,
                      elevation: 5,
                    },
                    left: {
                      backgroundColor: "white",
                      color: GlobalColors.colors.pink500,

                      shadowColor: "#333333",
                      shadowOffset: { width: 2, height: 3 },
                      shadowRadius: 1,
                      shadowOpacity: 0.2,
                      elevation: 5,
                    },
                  }}
                  textStyle={{
                    left: {
                      color: GlobalColors.colors.pink500,
                    },
                    right: {
                      color: GlobalColors.colors.gray0,
                    },
                  }}
                  timeTextStyle={{
                    left: { color: GlobalColors.colors.pink500 },
                    right: { color: GlobalColors.colors.gray0 },
                  }}
                />
              </View>
            );
          }}
          alwaysShowSend={true}
          renderSend={(props) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  top: -50,
                  marginLeft: 50,
                }}
              >
                {auxImage !== "" && (
                  <Image
                    source={{ uri: auxImage }}
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
                    color={GlobalColors.colors.pink500}
                    name="camera-image"
                    style={{ marginRight: 10, alignSelf: "center" }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={galleryPhotoHandler}>
                  <MaterialCommunityIcon
                    size={21}
                    color={GlobalColors.colors.pink500}
                    name="file-image-plus-outline"
                    style={{ marginRight: 10, alignSelf: "center" }}
                  />
                </TouchableOpacity>

                <Send
                  {...props}
                  containerStyle={{ justifyContent: "center", marginRight: 17 }}
                >
                  <FeatherIcon
                    size={20}
                    style={{ top: 1 }}
                    color={GlobalColors.colors.pink500}
                    name="send"
                  />
                </Send>
              </View>
            );
          }}
        />
      </ImageBackground>
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
    color: GlobalColors.colors.gray0,

    lineHeight: 20,
  },
});
