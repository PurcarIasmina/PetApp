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
function DoctorEditCard({ navigation }) {
  const route = useRoute();
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={saveHandler}>
        <FontAwesome
          name="save"
          size={21}
          color={GlobalColors.colors.pink500}
        />
      </TouchableOpacity>
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
            color={GlobalColors.colors.pink10}
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
          color={GlobalColors.colors.pink10}
        >
          Take Photo
        </ButtonCustom>
        <ButtonCustom
          onPress={galleryPhotoHandler}
          color={GlobalColors.colors.pink10}
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
        backgroundColor: GlobalColors.colors.pink10,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          alignSelf: "center",
          fontFamily: "Garet-Book",
          color: "white",
          marginTop: error ? 80 : 90,
          marginRight: 10,
        }}
      >
        Your profile
        <FontAwesome
          name="stethoscope"
          size={30}
          color={GlobalColors.colors.pink500}
          style={{ left: 10 }}
        />
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={[styles.infoContainer, bottom && styles.bottomOn]}>
        <ImageBackground
          style={styles.imageStyle}
          imageStyle={{ borderRadius: 75 }}
          source={photo.length > 0 ? { uri: photo } : null}
        >
          <TouchableOpacity
            onPress={() => {
              bs.current.snapTo(0), setBottom(true);
            }}
          >
            <Ionicons
              size={50}
              color={!invalid.photoInvalid ? GlobalColors.colors.pink1 : "red"}
              name="camera-outline"
              style={styles.icon}
            ></Ionicons>
          </TouchableOpacity>
        </ImageBackground>
        <View style={{ marginTop: 20, marginLeft: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -80,
              backgroundColor: GlobalColors.colors.pink10,
              borderColor: invalid.genderInvalid ? "red" : "transparent",
              borderWidth: 1,
              opacity: 0.7,
              borderRadius: 30,
              width: "34%",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              style={gender === "Male" ? styles.selected : styles.notSelected}
              onPress={handleMalePress}
            >
              <FontAwesome
                name="mars"
                size={35}
                color={
                  gender === "Male" ? GlobalColors.colors.darkGrey : "white"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={gender === "Female" ? styles.selected : styles.notSelected}
              onPress={handleFemalePress}
            >
              <FontAwesome
                name="venus"
                size={35}
                color={
                  gender === "Female" ? GlobalColors.colors.darkGrey : "white"
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputsContainer}>
            <View style={{ marginTop: -18 }}>
              <Text style={styles.titleInput}>Enter your full name</Text>
              <TextInput
                placeholder="Full name..."
                value={fullname}
                onChangeText={handleFullNameChange}
                placeholderTextColor={GlobalColors.colors.pink500}
                style={[
                  styles.inputField,
                  invalid.fullnameInvalid && styles.inputInvalid,
                ]}
                color={GlobalColors.colors.pink500}
              />
            </View>
            <Text style={styles.titleInput}>Enter your birthday date</Text>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                borderRadius: 8,
                borderColor: invalid.birthdayInvalid
                  ? "red"
                  : GlobalColors.colors.pink500,
                width: "90%",
                borderWidth: 1,
                marginLeft: 10,
                padding: 5,
              }}
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
                style={[
                  {
                    color: GlobalColors.colors.pink500,
                    marginLeft: 7,
                    fontSize: 15,
                    fontFamily: "Garet-Book",
                  },
                  ,
                ]}
              />
            </View>
            <View>
              <Text style={styles.titleInput}>Enter your telephone number</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Telephone number..."
                placeholderTextColor={GlobalColors.colors.pink500}
                style={[
                  {
                    backgroundColor: "white",
                    borderRadius: 8,
                    borderColor: GlobalColors.colors.pink500,
                    width: "90%",
                    borderWidth: 1,
                    marginLeft: 10,
                    padding: 5,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontFamily: "Garet-Book",
                  },
                  invalid.telephoneInvalid && styles.inputInvalid,
                ]}
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
          snapPoints={[330, -80]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
      </View>
    </View>
  );
}
export default DoctorEditCard;
const styles = StyleSheet.create({
  infoContainer: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 160,
    flex: 1,
    backgroundColor: "white",
    top: 40,
  },
  imageStyle: {
    width: 150,
    height: 150,
    borderRadius: 750,
    borderWidth: 0.5,
    borderColor: GlobalColors.colors.pink1,
    backgroundColor: GlobalColors.colors.pink10,
    marginTop: 30,
    marginLeft: 102,
  },
  icon: {
    alignSelf: "center",
    marginTop: 50,
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
    color: GlobalColors.colors.pink10,
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
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: GlobalColors.colors.pink500,
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
    borderRadius: 8,
    padding: 10,
    marginTop: 30,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    left: -5,
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
    backgroundColor: GlobalColors.colors.pink10,
    height: 380,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 30,
    opacity: 0.8,
    marginLeft: -45,
  },
  titleInput: {
    padding: 10,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontSize: 15,
  },
  inputField: {
    fontSize: 15,
    marginLeft: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalColors.colors.pink500,
    height: 30,
    width: "90%",
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontFamily: "Garet-Book",
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
    borderColor: "red",
    color: "red",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
  },
});
