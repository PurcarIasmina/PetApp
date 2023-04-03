import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { GlobalColors } from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { getAgeYear } from "../util/date";
import { useFonts } from "expo-font";
import moment from "moment";
import Swiper from "react-native-swiper";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { Button, Modal } from "react-native-paper";
import { addAppointment, getUsersAnimals } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../context/auth";
import AnimalCard from "../components/Appointments/CardAnimal";
function DoctorBookAppointment({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
  });
  const route = useRoute();
  const [docDetails, setDocDetails] = useState({
    fullname: route.params.details.fullname,
    name: route.params.details.name,
    photo: route.params.details.photo,
    gender: route.params.details.gender,
    description: route.params.details.description,
    telephone: route.params.details.telephone,
    birthday: route.params.details.birthday,
    did: route.params.details.did,
  });
  const authCtx = useContext(AuthContext);
  const [id, setId] = useState();
  const [fetching, setFetching] = useState(false);

  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
    "Roboto-Regular": require("../constants/fonts/Roboto-Regular.ttf"),
  });

  const monthNames = [
    "Ian.",
    "Feb.",
    "Mar.",
    "Apr.",
    "Mai",
    "Iun.",
    "Iul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(date);
  const swiper = useRef();
  const formattedMonth = monthNames[date.getMonth()];
  const [selectedSlot, setSelectedSlot] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [animals, setUserAnimals] = useState([]);
  const [animalsFetching, setAnimalsFetching] = useState(false);
  const [count, setCount] = useState(0);
  let animalss = [];

  useEffect(() => {
    async function getAnimals() {
      try {
        setAnimalsFetching(true);
        console.log(authCtx.uid);
        animalss = await getUsersAnimals(authCtx.uid);
        console.log(animalss);
        setUserAnimals(animalss);
      } catch (error) {
        console.log(error);
      }
      setAnimalsFetching(false);
    }
    getAnimals();
  }, []);

  const handleNextDay = () => {
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    setDate(nextDate);
    setSelectedDate(nextDate);
  };
  const handlePrevDay = () => {
    const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    setDate(prevDate);
    setSelectedDate(prevDate);
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    setDate(date);
  };
  const daysToShow = 5;
  const prevDate = moment(selectedDate);
  const nextDate = moment(selectedDate).add(1, "days");
  const onLayoutRootView = useCallback(async () => {
    if (fonts) {
      await SplashScreen.hideAsync();
    }
  }, [fonts]);

  if (!fonts) {
    return null;
  }
  const renderDate = (date, index) => {
    return (
      <TouchableOpacity
        onPress={() => onDateSelect(date)}
        onLayout={onLayoutRootView}
      >
        <View
          style={
            date.toDateString() === selectedDate.toDateString()
              ? [styles.containerdate, styles.selectedDate]
              : styles.containerdate
          }
          key={index}
        >
          <>
            <Text style={styles.itemWeekday}>
              {date.toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </Text>
            <Text style={styles.itemDate}>
              {date.toLocaleDateString("en-US", {
                day: "numeric",
              })}
            </Text>
          </>
        </View>
      </TouchableOpacity>
    );
  };
  function handleSlotPressed(index) {
    if (index !== selectedSlot) {
      setModalVisible(true);
      setSelectedSlot(index);
    } else setSelectedSlot(-1);
  }
  async function onPressButton() {
    if (count > 1) {
      Alert.alert("", "You can select just one animal for this slot!", [{}], {
        messageStyle: {
          fontFamily: "Garet-Book",
          color: GlobalColors.colors.pink500,
          textAlign: "center",
        },
        textStyle: {
          fontFamily: "Garet-Book",
          color: GlobalColors.colors.pink500,
        },
      });
    } else {
      try {
        const resp = await addAppointment(
          docDetails.did,
          authCtx.uid,
          id,
          selectedDate,
          selectedSlot
        );
        navigation.navigate("UserAppointments");
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.docContainer}>
        <View style={styles.infoContainer}>
          <Image
            style={styles.docImage}
            source={{ uri: docDetails.photo }}
          ></Image>
          <View>
            <Text style={styles.name}>Dr.{docDetails.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome
                name={docDetails.gender === "Female" ? "venus" : "mars"}
                color={GlobalColors.colors.darkGrey}
                size={14}
                style={styles.gender}
              ></FontAwesome>
              <Text style={styles.age}>{getAgeYear(docDetails.birthday)}y</Text>
            </View>
            <Text style={styles.telephone}>
              For emergency: {docDetails.telephone}
            </Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{docDetails.description}</Text>
        </View>
      </View>
      <Text style={[styles.name, { alignSelf: "center" }]}>
        Book an appointment
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selectedDate > currentDate && (
          <TouchableOpacity onPress={handlePrevDay}>
            <Ionicons
              style={styles.arrows}
              name="arrow-back-circle-outline"
              size={18}
            ></Ionicons>
          </TouchableOpacity>
        )}
        <Text style={styles.day}>
          {date.getDate()} {formattedMonth} {date.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Ionicons
            style={styles.arrows}
            name="arrow-forward-circle-outline"
            size={18}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.datespicker}>
          <Swiper
            index={selectedDate.getDay()}
            ref={swiper}
            removeClippedSubviews={false}
            scrollEnabled={true}
            horizontal
          >
            <View style={styles.daterow}>
              {[...Array(daysToShow)].map((_, index) => {
                const date = moment(prevDate).add(index, "days");

                return renderDate(date.toDate(), index);
              })}
            </View>
          </Swiper>
        </View>
        <View style={styles.slots}>
          <Text style={styles.slotTitle}>Available slots</Text>
          <FlatList
            data={["10:00-10:30PM", "10:30-11:00PM", "11:00-11:30PM"]}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  selectedSlot === index && styles.selected,
                ]}
                onPress={handleSlotPressed.bind(this, index)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === index && {
                      color: GlobalColors.colors.blue500,
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={(item) => item.did}
            contentContainerStyle={styles.list}
          ></FlatList>
        </View>
      </SafeAreaView>
      <Modal
        visible={modalVisible}
        transparent={true}
        style={styles.modal}
        onDismiss={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.animalsContainer}>
          <Text style={styles.petChooseText}>Choose your pet</Text>
          <FlatList
            data={animals}
            renderItem={({ item, index }) =>
              animalsFetching ? (
                <LoadingOverlay message="Fetching"></LoadingOverlay>
              ) : (
                <AnimalCard animal={item} setCount={setCount} setId={setId} />
              )
            }
          ></FlatList>
          <Button
            textColor={GlobalColors.colors.pink500}
            style={styles.confirmButton}
            onPress={onPressButton}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </View>
  );
}
export default DoctorBookAppointment;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.colors.white1,
  },
  docContainer: {
    height: 230,
    marginHorizontal: 20,
    borderRadius: 20,
    marginRight: 20,
    backgroundColor: "white",
    marginTop: 130,
  },
  docImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: "flex-start",
  },
  infoContainer: {
    flexDirection: "row",
  },
  name: {
    marginTop: 30,
    color: GlobalColors.colors.pink500,
    fontSize: 20,
    fontFamily: "Garet-Book",
  },
  age: {
    fontSize: 16,
    color: GlobalColors.colors.darkGrey,
    fontFamily: "Garet-Book",
    paddingHorizontal: 5,
  },
  gender: {
    marginTop: 5,
  },
  telephone: {
    fontSize: 12,
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
  },
  descriptionContainer: {
    height: 70,
    marginTop: 20,
    elevation: 5,
    backgroundColor: GlobalColors.colors.white1,
    marginHorizontal: 20,
    shadowColor: GlobalColors.colors.white1,
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    borderRadius: 20,
    padding: 10,
  },
  description: {
    fontFamily: "Garet-Book",
    fontSize: 12,
    color: GlobalColors.colors.darkGrey,
    marginLeft: 10,
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
  },
  arrows: {
    color: GlobalColors.colors.pink500,
    paddingHorizontal: 8,
  },

  appointments: {
    color: GlobalColors.colors.mint1,
    marginLeft: 40,
    top: -20,
    fontSize: 15,
    fontFamily: "Garet-Book",
  },
  datespicker: {
    // flex: 1,
    maxHeight: 100,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  daterow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },

  containerdate: {
    height: 55,
    width: 50,
    marginHorizontal: 15,
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: GlobalColors.colors.gray10,
    flexDirection: "column",
    alignItems: "center",
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: GlobalColors.colors.pink500,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: GlobalColors.colors.pink500,
  },
  selectedDate: {
    backgroundColor: GlobalColors.colors.white1,
  },
  slots: { flex: 1 },
  slotTitle: {
    color: GlobalColors.colors.pink500,
    fontSize: 20,
    marginLeft: 20,
    fontFamily: "Garet-Book",
  },
  list: {
    flexGrow: 1,
  },
  timeSlot: {
    width: "45%",
    height: 40,
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: GlobalColors.colors.darkGrey,
    backgroundColor: "white",

    margin: 10,
  },
  slotText: {
    alignSelf: "center",
    marginVertical: 10,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
  },
  selected: {
    borderColor: GlobalColors.colors.pink500,
    backgroundColor: GlobalColors.colors.pink1,
  },
  modal: {
    backgroundColor: "white",
    alignSelf: "center",
    height: 500,
    marginHorizontal: 30,

    flex: 1,
    marginTop: 200,
    // position: "relative",
    borderRadius: 20,
  },
  animalsContainer: {
    justifyContent: "flex-start",
  },
  petChooseText: {
    alignSelf: "center",
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: GlobalColors.colors.white1,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginHorizontal: 70,
    marginTop: 10,
  },
});
