import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState, createRef } from "react";
import { AuthContext } from "../../context/auth";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { GlobalColors } from "../../constants/colors";
import ButtonCustom from "../../components/UI/ButtonCustom";
import { editUser } from "../../store/databases";
import { storeImage } from "../../store/databases";
import { useRoute } from "@react-navigation/native";
import LoadingOverlay from "../UI/LoadingOverlay";
import { BlurView } from "expo-blur";
function DoctorEditCard({ navigation }) {
  const route = useRoute();
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
            // marginTop: error ? 80 : 90,
            // marginRight: 160,
            position: "absolute",
            right: 140,
          }}
        >
          Your profile
          <FontAwesome
            name="stethoscope"
            size={30}
            color={GlobalColors.colors.pink500}
          />
        </Text>
        <TouchableOpacity style={{ marginRight: 20 }} onPress={saveHandler}>
          <FontAwesome
            name="save"
            size={21}
            color={GlobalColors.colors.pink500}
          />
        </TouchableOpacity>
      </View>
    ),
    headerBackground: () => (
      <BlurView tint={"dark"} intensity={20} style={StyleSheet.absoluteFill} />
    ),
  });
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [imagePicked, setImagePicked] = useState(false);
  const authCtx = useContext(AuthContext);
  const [photo, setPhoto] = useState(route.params ? route.params.photo : "");
  const [photoo, setPhotoo] = useState(route.params ? route.params.photo : "");
  const [description, setDescription] = useState(
    route.params ? route.params.description : ""
  );
  const [gender, setGender] = useState(route.params ? route.params.gender : "");
  const [birthday, setBirthday] = useState(
    route.params ? route.params.birthday : ""
  );
  const [fullname, setFullName] = useState(
    route.params ? route.params.fullname : ""
  );
  const [telephone, setTelephone] = useState(
    route.params ? route.params.telephone : ""
  );
  const [bottom, setBottom] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState({
    fullnameInvalid: false,
    telephoneInvalid: false,
    genderInvalid: false,
    birthdayInvalid: false,
    descriptionInvalid: false,
    photoInvalid: false,
  });
  const bs = createRef();
  const fall = new Animated.Value(1);
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
      setPhoto(result.uri);
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
      setPhoto(result.uri);
      console.log(result.uri);
    }
  };
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
        <TouchableOpacity
          onPress={() => {
            bs.current.snapTo(1), setBottom(false);
          }}
        >
          <Ionicons
            name="close-circle"
            size={40}
            color={GlobalColors.colors.pink500}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ top: -40 }}>
        <Text style={styles.title}>UPLOAD A PHOTO OF YOU</Text>
        <ButtonCustom
          onPress={takePhotoHandler}
          color={GlobalColors.colors.pink500}
        >
          Take Photo
        </ButtonCustom>
        <ButtonCustom
          onPress={galleryPhotoHandler}
          color={GlobalColors.colors.pink500}
        >
          Choose from library
        </ButtonCustom>
      </View>
    </View>
  );

  const handleMalePress = () => {
    setGender("Male");
  };

  const handleFemalePress = () => {
    setGender("Female");
  };
  const handleFullNameChange = (text) => {
    setFullName(text);
  };
  const handleChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, "");
    if (formattedText.length > 4) {
      formattedText = formattedText.slice(0, 4) + "/" + formattedText.slice(4);
    }
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + "/" + formattedText.slice(2);
    }

    setBirthday(formattedText);
  };
  function updateError(error, stateUpdater) {
    stateUpdater(error);
    setTimeout(() => {
      invalid.fullnameInvalid = false;
      invalid.telephoneInvalid = false;
      invalid.descriptionInvalid = false;
      invalid.birthdayInvalid = false;
      invalid.genderInvalid = false;
      invalid.photoInvalid = false;
      stateUpdater("");
    }, 5000);
  }

  function handlerValidation() {
    let ok = 0;
    if (!fullname.trim()) {
      invalid.fullnameInvalid = true;
      ok = 1;
    }
    if (!telephone.trim()) {
      invalid.telephoneInvalid = true;
      ok = 1;
    }
    if (!gender.trim()) {
      invalid.genderInvalid = true;
      ok = 1;
    }
    if (!birthday.trim()) {
      invalid.birthdayInvalid = true;
      ok = 1;
    }
    if (!description.trim()) {
      invalid.descriptionInvalid = true;
      ok = 1;
    }
    if (!photo.trim()) {
      invalid.photoInvalid = true;
      ok = 1;
    }
    if (ok === 1) return updateError("All fields requiered!", setError);
    else return true;
  }

  async function saveHandler() {
    if (handlerValidation()) {
      try {
        setFetching(true);

        const resp = await editUser(
          telephone,
          description,
          fullname,
          gender,
          birthday,
          authCtx.uid
        );
        if (photo != photoo)
          await storeImage(photo, `doctor/${authCtx.uid}.jpeg`);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
      navigation.navigate("DoctorProfileScreen", {
        telephone: telephone,
        description: description,
        fullname: fullname,
        gender: gender,
        birthday: birthday,
        photo: photo,
        did: authCtx.uid,
      });
    }
  }
  if (fetching) return <LoadingOverlay message={"Loading..."}></LoadingOverlay>;
  return (
    <View
      style={{
        height: "100%",
        top: -40,
      }}
    >
      <View style={[styles.infoContainer, bottom && styles.bottomOn]}>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.imageStyle}
            source={photo.length > 0 ? { uri: photo } : null}
          ></ImageBackground>
        </View>
        <View style={styles.userPictureContainer}>
          <ImageBackground
            source={photo.length > 0 ? { uri: photo } : null}
            style={[
              styles.userPicture,
              photo.length === 0 && {
                borderColor: GlobalColors.colors.gray1,
                borderWidth: 1,
                borderRadius: 115,
              },
            ]}
            imageStyle={{ borderRadius: 115 }}
          >
            <TouchableOpacity
              onPress={() => {
                bs.current.snapTo(0), setBottom(true);
              }}
            >
              <Ionicons
                size={50}
                color={
                  !invalid.photoInvalid
                    ? GlobalColors.colors.gray1
                    : GlobalColors.colors.darkGrey
                }
                name="camera-outline"
                style={styles.icon}
              ></Ionicons>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.genderContainer,
            invalid.genderInvalid && {
              backgroundColor: GlobalColors.colors.gray1,
            },
          ]}
        >
          <TouchableOpacity
            style={gender === "Male" ? styles.selected : styles.notSelected}
            onPress={handleMalePress}
          >
            <FontAwesome
              name="mars"
              size={20}
              color={gender === "Male" ? GlobalColors.colors.darkGrey : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={gender === "Female" ? styles.selected : styles.notSelected}
            onPress={handleFemalePress}
          >
            <FontAwesome
              name="venus"
              size={20}
              color={
                gender === "Female" ? GlobalColors.colors.darkGrey : "white"
              }
            />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputsContainer}>
          <View>
            <Text style={styles.titleInput}>Enter your full name</Text>
            <View
              style={[
                styles.inputFieldContainer,
                invalid.fullnameInvalid && styles.inputInvalid,
              ]}
            >
              <TextInput
                placeholder="Full name..."
                value={fullname}
                onChangeText={handleFullNameChange}
                placeholderTextColor={GlobalColors.colors.pink500}
                style={[
                  {
                    color: GlobalColors.colors.pink500,
                    marginLeft: 7,
                    fontSize: 15,
                    fontFamily: "Garet-Book",
                  },
                ]}
                color={GlobalColors.colors.pink500}
              />
            </View>
          </View>
          <Text style={styles.titleInput}>Enter your birthday date</Text>
          <View
            style={[
              styles.inputFieldContainer,
              invalid.birthdayInvalid && styles.inputInvalid,
            ]}
          >
            <View style={{ flexDirection: "row", marginLeft: 10, top: 3 }}>
              <FontAwesome
                name="calendar"
                size={13}
                style={{ marginLeft: -3 }}
                color={GlobalColors.colors.pink500}
              />
              <FontAwesome
                name="pencil"
                size={11}
                style={{ marginLeft: -8, top: 5 }}
                color={GlobalColors.colors.pink500}
              />
            </View>

            <TextInput
              placeholder="DD/MM/YYYY"
              value={birthday}
              onChangeText={handleChange}
              keyboardType="numeric"
              maxLength={10}
              color={GlobalColors.colors.pink500}
              placeholderTextColor={GlobalColors.colors.pink500}
              style={styles.textInputStyle}
            />
          </View>

          <Text style={styles.titleInput}>Enter your telephone number</Text>
          <View
            style={[
              styles.inputFieldContainer,
              invalid.telephoneInvalid && styles.inputInvalid,
            ]}
          >
            <TextInput
              keyboardType="numeric"
              placeholder="Telephone number..."
              placeholderTextColor={GlobalColors.colors.pink500}
              style={styles.textInputStyle}
              color={GlobalColors.colors.pink500}
              onChangeText={(text) => setTelephone(text)}
              value={telephone}
            />
          </View>

          <TextInput
            style={[
              styles.Descriptioninput,
              invalid.descriptionInvalid && styles.inputInvalid,
            ]}
            multiline={true}
            placeholder="Short description about yourself..."
            placeholderTextColor={GlobalColors.colors.pink500}
            maxLength={1000}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
      <BottomSheet
        ref={bs}
        snapPoints={[300, -80]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
    </View>
  );
}
export default DoctorEditCard;
const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    backgroundColor: "white",
    top: 40,
  },

  icon: {
    alignSelf: "center",
  },
  header: {
    backgroundColor: "white",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    marginLeft: 20,
    backgroundColor: "white",
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: "white",
    marginBottom: 10,
  },

  title: {
    textAlign: "center",
    fontFamily: "Garet-Book",
    fontWeight: "900",
    fontSize: 20,
    paddingVertical: 20,
    color: GlobalColors.colors.pink500,
  },
  exitButton: {
    marginLeft: 10,
    marginTop: 5,
  },
  bottomOn: {
    opacity: 1,
  },
  panel: {
    padding: 20,
    backgroundColor: "white",
    paddingTop: 40,
  },
  Descriptioninput: {
    height: 80,
    textAlignVertical: "top",
    marginBottom: 10,
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    width: "100%",
    alignSelf: "center",
    backgroundColor: GlobalColors.colors.gray0,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
  },
  selected: {
    borderRadius: 50,
    padding: 10,
  },
  notSelected: {
    borderRadius: 50,
    padding: 10,
  },
  inputsContainer: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    width: "100%",
    alignSelf: "center",
    borderRadius: 30,
    top: 10,
  },
  titleInput: {
    marginBottom: 10,
    marginTop: 5,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontSize: 15,
    left: 4,
  },

  profileContainer: {
    backgroundColor: GlobalColors.colors.pink1,
    height: 250,
    width: "80%",
    borderRadius: 20,
    marginTop: 150,
    alignSelf: "center",
  },
  inputInvalid: {
    borderColor: GlobalColors.colors.gray1,
    borderWidth: 1,
  },
  error: {
    textAlign: "center",
    color: GlobalColors.colors.pink500,
    fontWeight: "bold",

    fontSize: 17,
  },
  inputFieldContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 10,

    backgroundColor: GlobalColors.colors.gray0,

    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
    marginBottom: 10,
  },
  textInputStyle: {
    color: GlobalColors.colors.pink500,
    marginLeft: 7,
    fontSize: 15,
    fontFamily: "Garet-Book",
  },
  imageContainer: {
    height: 250,
    width: "100%",
    borderColor: GlobalColors.colors.pink500,
  },
  imageStyle: {
    height: 350,
    opacity: 0.4,
  },
  userPictureContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    top: -50,
    borderEndWidth: 0.7,
    borderColor: GlobalColors.colors.pink500,
  },

  userPicture: {
    height: 230,
    width: 230,
    alignItems: "center",
    justifyContent: "center",
  },
  genderContainer: {
    backgroundColor: GlobalColors.colors.pink500,
    width: "40%",
    flexDirection: "row",
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    top: -20,
  },
});
