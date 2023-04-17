import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { GlobalColors } from "../../constants/colors";
import IconButton from "../UI/IconButton";
import { useFonts } from "expo-font";
import InfoLine from "./InfoLine";
import { useEffect, useState, createRef, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import ButtonCustom from "../UI/ButtonCustom";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SwitchSelector from "react-native-switch-selector";
import { AuthContext } from "../../context/auth";
import { getFormattedDate } from "../../util/date";
import { getAge } from "../../util/date";
import { editAnimal, editImage, storeImage } from "../../store/databases";
import LoadingOverlay from "../UI/LoadingOverlay";
import { Tooltip } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
function PetCard({
  name,
  breed,
  datebirth,
  owner,
  color,
  gender,
  photo,
  aid,
  generatedId,
}) {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [namee, setName] = useState(name);
  const [datebirthh, setDateBirth] = useState(
    getFormattedDate(new Date(datebirth))
  );
  const [breedd, setBreed] = useState(breed);
  const [aidd, setAid] = useState(aid);
  const [ownerr, setOwner] = useState(owner);
  const [colorr, setColor] = useState(color);
  const [photoo, setPhoto] = useState(photo);
  const [genderr, setGender] = useState(gender);
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
  const bs = createRef();
  const fall = new Animated.Value(1);
  const [open, setOpen] = useState(false);
  const [openTip, setOpenTip] = useState(false);

  const authCtx = useContext(AuthContext);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [imagePicked, setImagePicked] = useState(false);
  const [fonts] = useFonts({
    Lora: require("../../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../../constants/fonts/Garet-Book.ttf"),
  });
  const options = [
    { label: "Female", value: "Female" },
    { label: "Male", value: "Male" },
  ];
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

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.2 });

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setImagePicked(true);
      setPhoto(result.uri);
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

  function handleEditing() {
    setEditing(true);
  }
  async function saveHandler() {
    if (handlerValidation()) {
      try {
        setPushing(true);
        const resp = await editAnimal(generatedId, {
          nameA: namee,
          gender: genderr,
          color: colorr,
          breed: breedd,
          owner: ownerr,
          date: datebirthh,
          aid: aid,
          uid: authCtx.uid,
        });
        if (photo != photoo) {
          console.log("daa");
          //   console.log(photo);
          //   console.log(photoo);
          try {
            const respEditPhoto = await editImage(
              `${authCtx.uid}/${aid}.jpeg`,
              photoo
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setEditing(false);
      setPushing(false);
    }
  }
  if (pushing) return <LoadingOverlay message="Editing..." />;
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
      !namee.trim() ||
      !ownerr.trim() ||
      !breedd.trim() ||
      !colorr.trim() ||
      !photoo ||
      !datebirthh
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

  let mode = null;
  if (!editing) {
    mode = (
      <View style={styles.infoContainer}>
        <InfoLine name="Name" info={namee} />
        <InfoLine name="Breed" info={breedd} />
        <InfoLine name="Date of birth" info={datebirthh} />
        <InfoLine name="Owner" info={ownerr} />
        <InfoLine name="Color" info={colorr} />
        <InfoLine name="Gender" info={genderr} />
        <IconButton
          onPress={handleEditing}
          icon="build"
          label=""
          color="gray"
          size={25}
        />
      </View>
    );
  } else {
    mode = (
      <View style={styles.editContainer}>
        <View style={styles.editField}>
          <Text
            style={[
              styles.fieldName,
              typeInvalid.nameInvalid && styles.inputInvalid,
            ]}
          >
            Name
          </Text>
          <TextInput
            onChangeText={(value) => setName(value)}
            style={styles.field}
            defaultValue={namee}
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
            defaultValue={breedd}
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
            datebirthh
              ? moment(datebirthh).format("MM/DD/YYYY")
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
            date={new Date(datebirthh)}
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
            defaultValue={ownerr}
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
            defaultValue={colorr}
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
            options={options}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.editButtonContainer}>
            <IconButton
              left={150}
              bottom={0}
              icon="save"
              label=""
              color="gray"
              size={25}
              onPress={saveHandler}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <View style={bottom && styles.bottomOn}>
        <View style={styles.imageContainer}>
          <ImageBackground
            imageStyle={{ borderRadius: 100 }}
            style={styles.image}
            source={{ uri: photoo }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {editing && (
                <Ionicons
                  onPress={() => {
                    bs.current.snapTo(0), setBottom(true);
                  }}
                  name="camera"
                  color={GlobalColors.colors.white1}
                  size={25}
                  style={{
                    opacity: 0.8,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: typeInvalid.photoInvalid
                      ? "#8b0000"
                      : GlobalColors.colors.white1,
                    borderRadius: 10,
                  }}
                />
              )}
            </View>
          </ImageBackground>

          <Text style={styles.date}>{`${getAge(datebirthh).years}y ${
            getAge(datebirthh).months
          }m ${getAge(datebirthh).days}d`}</Text>
        </View>

        {mode}
        <View style={styles.buttonsContainer}>
          <IconButton
            onPress={() => {
              navigation.navigate("AnimalRecords", {
                aid: aidd,
                generatedId: generatedId,
                photoUrl: photo,
              });
            }}
            top={18}
            // text={20}
            // label={x}
            icon="clipboard"
            color={GlobalColors.colors.white1}
            size={28}
            tip
            tipText={"Medical Records"}
          />

          <IconButton
            onPress={() => {}}
            // label="Reminders"
            top={19}
            icon="notifications"
            color={GlobalColors.colors.white1}
            size={29}
            tip
            tipText={"Notifications"}
          />
          <IconButton
            onPress={() => {}}
            top={13}
            // label="Download"
            icon="download"
            color={GlobalColors.colors.white1}
            size={30}
            tip
            tipText={"Download files"}
          />
          <IconButton
            onPress={() => {}}
            // label="Attach"
            top={18}
            icon="attach"
            color={GlobalColors.colors.white1}
            // style={styles.exitButton}
            size={30}
            tip
            tipText={"Attach files"}
          />
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
export default PetCard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalColors.colors.white1,
    height: "100%",
  },
  image: {
    height: 180,
    width: 180,
    marginTop: 20,
    paddingVertical: 10,
    // marginLeft: 40,
    marginBottom: 10,
    alignSelf: "center",
  },
  buttonsContainer: {
    borderRadius: 50,
    marginHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    // paddingVertical: 20,
    marginTop: 80,
    backgroundColor: GlobalColors.colors.pink500,
    height: 50,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: GlobalColors.colors.white1,
    paddingHorizontal: 20,
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 2,
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
    margin: 15,
    marginTop: 50,
    borderRadius: 10,
    marginBottom: -10,
    height: 280,
    backgroundColor: GlobalColors.colors.white1,
    // shadowColor: "#171717",
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 0.1,
    flex: "flex-start",
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
    margin: 10,
    marginBottom: -60,
    padding: 10,
    borderRadius: 40,
    height: 400,
    backgroundColor: GlobalColors.colors.white1,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignContent: "center",
    // justifyContent:'center',
  },
  editField: {
    flexDirection: "column",
    marginHorizontal: 60,
    marginVertical: 5,
    alignContent: "center",
    justifyContent: "center",
  },
  field: {
    width: "90%",
    borderBottomColor: GlobalColors.colors.pink500,
    borderBottomWidth: 0.5,
    height: 30,
    paddingVertical: 10,
    color: "gray",
    fontWeight: "bold",
    alignContent: "center",
    fontSize: 15,
  },
  fieldName: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontWeight: "900",
  },
  iconContainer: {
    marginTop: 300,
    marginRight: 200,
  },
  editButtonContainer: {
    alignContent: "center",
    flexDirection: "row-reverse",
    justifyContent: "center",
    padding: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: GlobalColors.colors.white1,
    paddingTop: 40,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: GlobalColors.colors.white1,
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 10,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    // alignItems: 'center',
    marginLeft: 20,
    backgroundColor: GlobalColors.colors.white1,
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: GlobalColors.colors.white1,
    marginBottom: 10,
  },
  //   imageContainer: {
  //     alignItems: "center",
  //   },
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
  },
  editDateField: {
    flexDirection: "row",
    marginHorizontal: 60,
    marginVertical: 5,
  },
  genderField: {
    marginHorizontal: 100,
    marginVertical: 10,
    left: -40,
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
  },
  error: {
    color: "#8b0000",
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: -20,
  },
});
