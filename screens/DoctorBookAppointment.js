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
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useLayoutEffect,
} from "react";
import { GlobalColors } from "../constants/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAgeYear, getFormattedDate, getAge } from "../util/date";
import { useFonts } from "expo-font";
import moment from "moment";
import Swiper from "react-native-swiper";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { Button, Modal } from "react-native-paper";
import {
  addAppointment,
  getAnimalDetails,
  getDoctorSlotsAppointments,
  getImageUrl,
  getUsersAnimals,
} from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../context/auth";
import AnimalCard from "../components/Appointments/CardAnimal";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
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
  const [id, setId] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [navailableSlots, setNAvailableSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState({});
  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
    "Roboto-Regular": require("../constants/fonts/Roboto-Regular.ttf"),
  });
  console.log(id);
  const monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  currentDate =
    // new Date(romanianTime).getDay() === 6 || 0
    //   ? new Date(romanianTime).getDay() === 6
    //     ? new Date(romanianTime) + 2
    //     : new Date(romanianTime) + 1
    //   :
    new Date(romanianTime);

  const auxDate = new Date(currentDate);
  if (
    auxDate instanceof Date &&
    (auxDate.getUTCDay() === 0 || auxDate.getUTCDay() === 6)
  ) {
    const daysToAdd = auxDate.getUTCDay() === 0 ? 1 : 2;
    auxDate.setUTCDate(auxDate.getUTCDate() + daysToAdd);
  }
  const [date, setDate] = useState(new Date(auxDate));
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  console.log(selectedDate);
  const swiper = useRef();
  const formattedMonth = monthNames[date.getMonth()];
  const [selectedSlot, setSelectedSlot] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [animals, setUserAnimals] = useState([]);
  const [animalsFetching, setAnimalsFetching] = useState(false);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [count, setCount] = useState(0);
  let animalss = [];

  useEffect(() => {
    async function getAnimals() {
      try {
        setAnimalsFetching(true);
        animalss = await getUsersAnimals(authCtx.uid);
        setUserAnimals(animalss);
      } catch (error) {
        console.log(error);
      }
      setAnimalsFetching(false);
    }

    getAnimals();
  }, []);
  useLayoutEffect(() => {
    async function getDoctorAvailableslots() {
      try {
        const slots = await getDoctorSlotsAppointments(
          docDetails.did,
          getFormattedDate(selectedDate)
        );

        setNAvailableSlots(slots);

        const availableSlots = calculateAvailableSlots(slots);
        console.log(availableSlots);
        setAvailableSlots(availableSlots);
      } catch (error) {
        console.log(error);
      }
    }

    getDoctorAvailableslots();
  }, [selectedDate]);

  const handleNextDay = () => {
    const timezoneOffset = new Date().getTimezoneOffset();
    const nextDate = moment(date).add(1, "day").add(timezoneOffset, "minutes");

    if (nextDate.isoWeekday() === 6 || nextDate.isoWeekday() === 7) {
      const daysUntilMonday = 8 - nextDate.isoWeekday();

      if (daysUntilMonday <= 5) {
        nextDate.add(daysUntilMonday, "days");
      }
    }

    setDate(nextDate.toDate());
    setSelectedDate(nextDate.toDate());
  };

  const handlePrevDay = () => {
    const prevDate = moment(date)
      .subtract(1, "day")
      .add(timezoneOffset, "minutes");

    if (prevDate.isoWeekday() === 7) {
      const daysUntilFriday = 2;
      prevDate.subtract(daysUntilFriday, "days");
    }

    setDate(prevDate.toDate());
    setSelectedDate(prevDate.toDate());
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
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    console.log(date);
    const onPressHandler = isWeekend ? undefined : () => onDateSelect(date);

    return (
      <TouchableOpacity
        onPress={onPressHandler}
        disabled={isWeekend}
        onLayout={onLayoutRootView}
      >
        <View
          style={[
            date.toLocaleDateString() === selectedDate.toLocaleDateString()
              ? [styles.containerdate, styles.selectedDate]
              : styles.containerdate,
            isWeekend && { opacity: 0.4 },
          ]}
          key={index}
        >
          <>
            <Text style={styles.itemWeekday}>
              {daysOfWeek[date.getUTCDay()]}
            </Text>
            <Text style={styles.itemDate}>{date.getUTCDate()}</Text>
          </>
        </View>
      </TouchableOpacity>
    );
  };

  function handleSlotPressed(item) {
    if (item !== selectedSlot) {
      setModalVisible(true);
      setSelectedSlot(item);
    } else setSelectedSlot("");
  }
  async function onPressButton() {
    try {
      console.log(ownerName);
      await addAppointment(
        docDetails.did,
        authCtx.uid,
        id[0],
        getFormattedDate(selectedDate),
        selectedSlot,
        appointmentReason,
        ownerName
      );
      navigation.navigate("UserAppointments");
    } catch (error) {
      console.log(error);
    }
  }

  function calculateAvailableSlots(navailableSlots) {
    const availableSlots = [];
    const currentHour = currentDate.getUTCHours();
    const currentMinute = currentDate.getUTCMinutes();
    for (let i = 10; i <= 16; i++) {
      for (let j = 0; j < 2; j++) {
        const slotStartTime = `${i}:${j === 0 ? "00" : "30"}`;
        const slotEndTime = `${j === 0 ? i : i + 1}:${j === 0 ? "30" : "00"}`;

        console.log(
          `${currentHour}:${currentMinute}` < `${slotStartTime}`,
          getFormattedDate(selectedDate) === getFormattedDate(currentDate),
          currentDate,
          selectedDate
        );
        if (
          (getFormattedDate(selectedDate) === getFormattedDate(currentDate) &&
            `${currentHour}:${currentMinute}` < `${slotStartTime}`) ||
          getFormattedDate(selectedDate) > getFormattedDate(currentDate)
        ) {
          const isSlotOccupied =
            navailableSlots.length > 0
              ? navailableSlots.some((slot) => {
                  return `${slot}` === `${slotStartTime}-${slotEndTime}`;
                })
              : false;

          if (!isSlotOccupied) {
            availableSlots.push(`${slotStartTime}-${slotEndTime}`);
          }
        }
      }
    }
    return availableSlots;
  }
  async function onNextPressButton() {
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
      setConfirmModal(true);
      try {
        const animalDetails = await getAnimalDetails(id[0]);
        const animalPhoto = await getImageUrl(
          `${animalDetails.uid}/${animalDetails.aid}.jpeg`
        );
        console.log(animalPhoto);
        setSelectedAnimal({ ...animalDetails, photoUrl: animalPhoto });
        console.log(selectedAnimal);
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
            <Text></Text>
            <Text style={[styles.name, { left: -23 }]}>
              Dr.{docDetails.name}
            </Text>
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
          {date.getUTCDate()} {formattedMonth} {date.getUTCFullYear()}
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
            data={availableSlots}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  selectedSlot === item && styles.selected,
                ]}
                onPress={handleSlotPressed.bind(this, item)}
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
            keyExtractor={(item) => item}
            contentContainerStyle={styles.list}
          ></FlatList>
        </View>
      </SafeAreaView>
      <Modal
        visible={modalVisible}
        transparent={true}
        style={styles.modal}
        onDismiss={() => {
          setModalVisible(false), setConfirmModal(false), setCount(0);
          setId([]);
        }}
        animationType="slide"
      >
        {!confirmModal && (
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
              onPress={onNextPressButton}
            >
              Next
            </Button>
          </View>
        )}
        {confirmModal && (
          <View>
            <Text style={[styles.petChooseText, { top: -30, fontSize: 16 }]}>
              Appointment details
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 32,
              }}
            >
              <Icon
                name="user-md"
                size={19}
                color={GlobalColors.colors.pink500}
                style={{ marginTop: 2 }}
              />
              <View
                style={{
                  marginLeft: 5,
                }}
              >
                <Text style={styles.infoAppointment}>
                  Dr. {docDetails.name}
                </Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", marginTop: 10, marginLeft: 32 }}
            >
              <Icon
                name="calendar-o"
                size={16}
                color={GlobalColors.colors.pink500}
                style={{ marginTop: 2 }}
              />

              <View
                style={{
                  marginLeft: 5,
                }}
              >
                <Text style={styles.infoAppointment}>
                  {selectedDate.toDateString()}
                </Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", marginTop: 10, marginLeft: 32 }}
            >
              <Icon
                name="clock-o"
                size={21}
                color={GlobalColors.colors.pink500}
                style={{ left: -1 }}
              />

              <View
                style={{
                  marginLeft: 3,
                }}
              >
                <Text style={styles.infoAppointment}>{selectedSlot}</Text>
              </View>
            </View>

            <View>
              <View style={styles.cardContainer}>
                <View style={styles.itemsContainer}>
                  <Image
                    style={styles.image}
                    source={{ uri: selectedAnimal.photoUrl }}
                  ></Image>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.name}>{selectedAnimal.nameA}</Text>
                    <Text style={styles.date}>
                      {selectedAnimal.breed},{" "}
                      {getAge(selectedAnimal.date).years}y{" "}
                      {getAge(selectedAnimal.date).months}m{" "}
                      {getAge(selectedAnimal.date).days}d
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter appointment reason"
                placeholderTextColor={GlobalColors.colors.pink500}
                style={styles.input}
                defaultValue={appointmentReason}
                onChangeText={(value) => {
                  setAppointmentReason(value);
                }}
              ></TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor={GlobalColors.colors.pink500}
                style={styles.input}
                defaultValue={ownerName}
                onChangeText={(value) => {
                  setOwnerName(value);
                }}
              ></TextInput>
            </View>
            <Button
              textColor={GlobalColors.colors.pink500}
              style={styles.confirmButton}
              onPress={onPressButton}
            >
              Confirm
            </Button>
          </View>
        )}
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
    borderColor: GlobalColors.colors.pink500,
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
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  itemsContainer: {
    // backgroundColor: "white",
    flexDirection: "row",
    width: "80%",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  cardContainer: {
    height: 100,
    marginHorizontal: 30,
    backgroundColor: GlobalColors.colors.white1,
    marginVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
  },
  name: {
    fontFamily: "Garet-Book",
    fontSize: 20,
    color: GlobalColors.colors.pink500,
    marginTop: 20,
    marginHorizontal: 20,
  },
  date: {
    fontFamily: "Garet-Book",
    fontSize: 10,
    color: GlobalColors.colors.darkGrey,

    marginHorizontal: 20,
  },
  infoAppointment: {
    color: GlobalColors.colors.pink500,
    paddingLeft: 5,
    fontFamily: "Garet-Book",
    fontSize: 15,
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: GlobalColors.colors.white1,
    height: 28,
    borderWidth: 0.2,
    marginLeft: 30,
    marginRight: 30,
    borderColor: GlobalColors.colors.pink500,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    paddingVertical: 0,
    color: GlobalColors.colors.pink500,
    fontFamily: "Garet-Book",
  },
});
