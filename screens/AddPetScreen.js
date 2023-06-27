import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { GlobalColors } from "../constants/colors";
import { useState, createRef, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "../components/UI/ButtonCustom";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SwitchSelector from "react-native-switch-selector";
import { addAnimal, getImageUrl, storeImage } from "../store/databases";
import { AuthContext } from "../context/auth";
import { getFormattedDate } from "../util/date";
import { Feather } from "@expo/vector-icons";
import LoadingOverlay from "../components/UI/LoadingOverlay";
function AddPetScreen({ navigation }) {
  const [name, setName] = useState("");
  const [datebirth, setDateBirth] = useState();
  const [breed, setBreed] = useState("");
  const [owner, setOwner] = useState("");
  const [color, setColor] = useState("");
  const [photo, setPhoto] = useState("");
  const [gender, setGender] = useState("Female");
  const [bottom, setBottom] = useState(false);
  const [typeInvalid, setTypeInvalid] = useState({
    nameInvalid: false,
    dateInvalid: false,
    breedInvalid: false,
    ownerInvalid: false,
    colorInvalid: false,
    genderInvalid: false,
    photoInvalid: false,
  });
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const bs = createRef();
  const fall = new Animated.Value(1);

  const [addingAnimal, setAddingAnimal] = useState(false);
  const options = [
    { label: "Female", value: "Female" },
    { label: "Male", value: "Male" },
  ];

  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerTintColor: photo.length > 0 ? "white" : GlobalColors.colors.pink500,

    headerRight: () => (
      <>
        <View style={styles.editButtonContainer}>
          <Feather
            name={"save"}
            color={photo.length > 0 ? "white" : GlobalColors.colors.pink500}
            size={22}
            onPress={saveHandler}
            style={styles.headerIcon}
          />
        </View>
      </>
    ),
  });
  function updateError(error, stateUpdater) {
    stateUpdater(error);
    setTimeout(() => {
      (typeInvalid.nameInvalid = false),
        (typeInvalid.ownerInvalid = false),
        (typeInvalid.colorInvalid = false),
        (typeInvalid.genderInvalid = false),
        (typeInvalid.breedInvalid = false),
        (typeInvalid.photoInvalid = false),
        (typeInvalid.dateInvalid = false);
      stateUpdater("");
    }, 5000);
  }
  function handlerValidation() {
    if (
      name.trim() === "" ||
      owner.trim() === "" ||
      breed.trim() === "" ||
      color.trim() === "" ||
      !photo ||
      !datebirth
    ) {
      typeInvalid.nameInvalid = true;
      typeInvalid.ownerInvalid = true;
      typeInvalid.breedInvalid = true;
      typeInvalid.genderInvalid = true;
      typeInvalid.colorInvalid = true;
      typeInvalid.photoInvalid = true;
      typeInvalid.dateInvalid = true;
      return updateError("All fields are required!", setError);
    }

    return true;
  }

  async function saveHandler() {
    if (handlerValidation()) {
      try {
        setAddingAnimal(true);
        const resp = await addAnimal(
          name,
          breed,
          datebirth,
          owner,
          color,
          gender,
          authCtx.uid
        );
        if (resp) {
          const imagePath = `${authCtx.uid}/${resp.aid}.jpeg`;
          const respPhoto = await storeImage(photo, imagePath);

          if (respPhoto) {
            try {
              const imgUrl = await getImageUrl(imagePath);
              navigation.navigate("PetScreen", {
                name: name,
                breed: breed,
                datebirth: datebirth,
                owner: owner,
                color: color,
                gender: gender,
                photo: imgUrl,
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
        setAddingAnimal(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  if (addingAnimal)
    return <LoadingOverlay message="Adding your pet friend..." />;

  function onConfirmDate(date) {
    setValue("datebirth", date);
    setOpen(false);
  }

  const galleryPhotoHandler = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  const takePhotoHandler = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setPhoto(result.uri);
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
      <View style={{ top: -60 }}>
        <Text style={styles.title}>UPLOAD PHOTO</Text>
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

  function setValue(type, value) {
    switch (type) {
      case "name":
        setName(value);
        break;
      case "datebirth":
        setDateBirth(getFormattedDate(value));
        break;
      case "breed":
        setBreed(value);
        break;
      case "owner":
        setOwner(value);
        break;
      case "color":
        setColor(value);
        break;
      case "gender":
        setGender(value);
        break;
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={bottom && styles.bottomOn}>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.image}
            imageStyle={{
              borderColor: GlobalColors.colors.pink500,
              borderWidth: photo ? 0 : 1,
            }}
            source={{ uri: photo }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                onPress={() => {
                  bs.current.snapTo(0), setBottom(true);
                }}
                name="camera"
                color={
                  photo
                    ? GlobalColors.colors.white1
                    : GlobalColors.colors.pink500
                }
                size={30}
                style={{
                  opacity: 0.8,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: typeInvalid.photoInvalid
                    ? "#8b0000"
                    : photo
                    ? GlobalColors.colors.white1
                    : GlobalColors.colors.pink500,
                  borderRadius: 10,
                }}
              />
            </View>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.editContainer,
            photo.length === 0 && {
              shadowColor: "#333333",
              shadowOffset: { width: -1, height: -3 },
              shadowRadius: 2,
              shadowOpacity: 0.4,
              elevation: 5,
            },
          ]}
        >
          <View style={styles.editField}>
            <Text
              style={[
                styles.fieldName,
                typeInvalid.nameInvalid && styles.inputInvalid,
                { marginTop: 30 },
              ]}
            >
              Name
            </Text>
            <TextInput
              isInvalid={typeInvalid.nameInvalid}
              onChangeText={setValue.bind(this, "name")}
              style={styles.field}
              defaultValue={name}
              keyboardType="default"
            />
          </View>
          <View style={styles.editField}>
            <Text
              style={[
                styles.fieldName,
                typeInvalid.breedInvalid && styles.inputInvalid,
              ]}
            >
              Breed
            </Text>
            <TextInput
              onChangeText={setValue.bind(this, "breed")}
              style={styles.field}
              defaultValue={breed}
              keyboardType="default"
            />
          </View>
          <View style={styles.editDateField}>
            <Text
              style={[
                styles.fieldName,
                typeInvalid.dateInvalid && styles.inputInvalid,
              ]}
            >{`Date:  ${
              datebirth
                ? moment(datebirth).format("MM/DD/YYYY")
                : "Please select date"
            }`}</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Ionicons
                name="calendar"
                style={{ marginHorizontal: 8 }}
                size={18}
                color="gray"
              />
            </TouchableOpacity>
            <DateTimePickerModal
              mode="date"
              date={datebirth}
              isVisible={open}
              onConfirm={onConfirmDate}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <View style={styles.editField}>
            <Text
              style={[
                styles.fieldName,
                typeInvalid.ownerInvalid && styles.inputInvalid,
              ]}
            >
              Owner
            </Text>
            <TextInput
              onChangeText={setValue.bind(this, "owner")}
              style={styles.field}
              defaultValue={owner}
              keyboardType="default"
            />
          </View>
          <View style={styles.editField}>
            <Text
              style={[
                styles.fieldName,
                typeInvalid.colorInvalid && styles.inputInvalid,
              ]}
            >
              Color
            </Text>
            <TextInput
              onChangeText={setValue.bind(this, "color")}
              style={styles.field}
              defaultValue={color}
              keyboardType="default"
            />
          </View>
          <View style={styles.genderField}>
            <SwitchSelector
              initial={0}
              onPress={setValue.bind(this, "gender")}
              textColor={GlobalColors.colors.pink500}
              selectedColor={GlobalColors.colors.pastel1}
              buttonColor={GlobalColors.colors.pink500}
              borderColor={
                typeInvalid.genderInvalid
                  ? "#8b0000"
                  : GlobalColors.colors.pink500
              }
              hasPadding
              borderRadius={10}
              options={options}
              testID="gender-switch-selector"
              accessibilityLabel="gender-switch-selector"
            />
          </View>

          <View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>
      </View>
      <BottomSheet
        ref={bs}
        snapPoints={[330, -40]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
    </View>
  );
}
export default AddPetScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },
  image: {
    height: 400,
    width: "100%",
    marginBottom: 10,
  },
  buttonsContainer: {
    borderRadius: 50,
    marginHorizontal: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 180,
    backgroundColor: GlobalColors.colors.pink500,
    height: 50,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "white",
    height: 300,
    marginBottom: 10,
  },
  name: {
    fontSize: 30,
    color: "white",
    marginTop: 350,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontFamily: "Lora",
  },
  infoContainer: {
    paddingTop: 30,
    margin: 15,
    marginHorizontal: 0,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: -10,
    height: 280,
    backgroundColor: "white",
    flex: "flex-start",
    paddingHorizontal: 30,
  },
  editButton: {
    alignSelf: "flex-start",
    marginLeft: 1,
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalColors.colors.pink500,
    outline: "none",
  },
  editContainer: {
    margin: 15,
    paddingHorizontal: 40,
    paddingTop: 30,
    top: 20,
    marginBottom: -60,
    marginHorizontal: 0,
    height: 400,
    backgroundColor: "white",
    borderRadius: 20,
  },
  editField: {
    flexDirection: "column",
    marginVertical: 5,
    alignContent: "center",
    justifyContent: "center",
  },
  field: {
    width: "100%",
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
    paddingVertical: 8,
    color: "gray",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,

    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.1,
  },
  fieldName: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 3,
    marginBottom: 2,
  },
  iconContainer: {
    marginTop: 300,
    marginRight: 200,
  },
  editButtonContainer: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  panel: {
    padding: 20,
    backgroundColor: "white",
    paddingTop: 40,
  },
  header: {
    backgroundColor: "white",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
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

  modalExtended: {
    height: "60%",
  },
  title: {
    textAlign: "center",
    fontFamily: "Garet-Book",
    fontWeight: "900",
    fontSize: 20,
    paddingVertical: 20,
    color: GlobalColors.colors.pink500,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: "100%",
    marginBottom: 10,
  },
  exitButton: {
    marginLeft: 10,
    marginTop: 5,
  },
  bottomOn: {
    opacity: 0.1,
    borderRadius: 10,
  },
  editDateField: {
    flexDirection: "row",

    marginVertical: 5,
  },
  genderField: {
    marginVertical: 10,
  },
  inputInvalid: {
    color: "#8b0000",
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    fontFamily: "Roboto",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "900",
    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: "Garet-Book",
    alignSelf: "center",
    marginBottom: 20,
  },
  error: {
    color: "#8b0000",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 32,
  },
  editButton: {
    alignSelf: "center",
    top: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    top: -20,
  },
  headerIcon: {
    right: 5,
    bottom: 2,
  },
});
