import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { GlobalColors } from "../constants/colors";
import { useEffect } from "react";
import { getFormattedDate } from "../util/date";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAllReservations } from "../store/databases";

function BookHotel({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0,
      borderBottomColor: GlobalColors.colors.gray0,
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
  });
  function updateError(error, stateUpdater) {
    stateUpdater(error);
    setTimeout(() => {
      setDateInvalid(false);
      setAnimalDatesInvalid(false);

      stateUpdater("");
    }, 5000);
  }
  const [error, setError] = useState("");
  const [numberAnimals, setNumberAnimals] = useState(1);
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Select dates...");
  const [animals, setAnimals] = useState([{ name: "", breed: "" }]);
  const [dateInvalid, setDateInvalid] = useState(false);
  const [animalDatesInvalid, setAnimalDatesInvalid] = useState(false);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function getreservations() {
      let resp = [];
      resp = await getAllReservations();
      setReservations(resp);
      console.log(reservations, "reservations");
    }
    getreservations();
  }, []);
  const calendarTheme = {
    calendarBackground: GlobalColors.colors.gray0,
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: GlobalColors.colors.pink500,
    selectedDayTextColor: GlobalColors.colors.gray0,
    todayTextColor: GlobalColors.colors.pink10,
    dayTextColor: GlobalColors.colors.pink500,
    textDisabledColor: GlobalColors.colors.gray10,
    dotColor: GlobalColors.colors.pink500,
    selectedDotColor: GlobalColors.colors.pink500,
    arrowColor: GlobalColors.colors.pink500,
    disabledArrowColor: "#d9e1e8",
    monthTextColor: GlobalColors.colors.pink500,
    indicatorColor: GlobalColors.pink500,
    textDayFontFamily: "Garet-Book",
    textMonthFontFamily: "Garet-Book",
    textDayHeaderFontFamily: "Garet-Book",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  console.log(animals);
  function handlerValidation() {
    console.log(selectedDate);
    if (selectedDate === "Select dates...") {
      setDateInvalid(true);
      return updateError("Select a date!", setError);
    }
    if (getAvailableSpots(startDate, selectedDate) - animals.length < 0) {
      setDateInvalid(true);
      return updateError("No places available for selected dates!", setError);
    }
    const emptyAnimalFields = animals.filter(
      (animal) => animal.name.trim() === "" || animal.breed.trim() === ""
    );

    if (emptyAnimalFields.length > 0 || animals.length === 0) {
      setAnimalDatesInvalid(true);
      return updateError("Please fill in all animal information!", setError);
    }
    return true;
  }

  const onDayPress = (day) => {
    const date = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);

      setMarkedDates({
        [date]: {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: GlobalColors.colors.pink500,
        },
      });
    } else if (startDate && !endDate && moment(date).isAfter(startDate)) {
      const range = markRange(startDate, date);
      setEndDate(date);

      setMarkedDates(range);
    } else {
      setStartDate(date);
      setEndDate(null);

      setMarkedDates({
        [date]: {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: GlobalColors.colors.pink500,
        },
      });
    }
  };
  function nextHandler() {
    if (handlerValidation()) {
      navigation.navigate("PayScreen", {
        startDate: startDate,
        endDate: endDate,
        animals: animals,
      });
    }
  }
  const markRange = (startDate, endDate) => {
    const range = {};
    let date = moment(startDate).add(1, "day");

    while (!date.isSame(endDate)) {
      range[date.format("YYYY-MM-DD")] = {
        selected: true,
        color: GlobalColors.colors.pink500,
        middle: true,
      };
      date = date.add(1, "day");
    }

    return {
      ...range,
      [startDate]: {
        startingDay: true,
        color: GlobalColors.colors.pink500,
        selected: true,
      },
      [endDate]: {
        endingDay: true,
        color: GlobalColors.colors.pink500,
        selected: true,
      },
    };
  };
  const handleIncrement = () => {
    setNumberAnimals(numberAnimals + 1);
    setAnimals([...animals, { name: "", breed: "" }]);
  };

  const handleDecrement = () => {
    if (numberAnimals > 1) {
      setNumberAnimals(numberAnimals - 1);
      setAnimals(animals.slice(0, -1));
    }
  };
  const handleAnimalNameChange = (index, value) => {
    const newAnimals = [...animals];
    newAnimals[index] = {
      ...newAnimals[index],
      name: value,
    };
    setAnimals(newAnimals);
  };
  const getAvailableSpots = (startDate, endDate) => {
    const totalSpots = 10;
    const overlappingReservations = reservations.filter((reservation) => {
      const resStartDate = reservation.startDate;
      const resEndDate = reservation.endDate;

      console.log(resStartDate, resEndDate);
      console.log(startDate, endDate);
      return (
        (resStartDate >= startDate && resStartDate <= endDate) ||
        (resEndDate > startDate && resEndDate <= endDate) ||
        (resStartDate <= startDate && resEndDate >= endDate)
      );
    });

    const availableSpots = totalSpots - overlappingReservations.length;
    return availableSpots;
  };
  const handleAnimalBreedChange = (index, value) => {
    const newAnimals = [...animals];
    newAnimals[index] = {
      ...newAnimals[index],
      breed: value,
    };
    setAnimals(newAnimals);
  };

  console.log(animals);
  const renderAnimalInputs = (event) => {
    const inputs = [];
    for (let i = 0; i < numberAnimals; i++) {
      inputs.push(
        <View
          key={i}
          style={{
            backgroundColor: GlobalColors.colors.gray1,
            marginHorizontal: 30,
            marginVertical: 20,
            padding: 10,
            paddingVertical: 20,
            borderRadius: 10,
            borderWidth:
              error === "Please fill in all animal information!" ? 1 : 0,
            borderColor: GlobalColors.colors.pink500,
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Animal name"
              value={animals[i]?.name || ""}
              style={styles.textInput}
              onChangeText={(value) => handleAnimalNameChange(i, value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Breed"
              value={animals[i]?.breed || ""}
              style={styles.textInput}
              onChangeText={(value) => handleAnimalBreedChange(i, value)}
            />
          </View>
        </View>
      );
    }
    return inputs;
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
        <Text style={styles.title}>Complete the following formular</Text>
        {error === "Select a date!" && (
          <Text style={[styles.title, { fontSize: 14, marginBottom: 2 }]}>
            Select date!
          </Text>
        )}
        {error === "No places available for selected dates!" && (
          <Text style={[styles.title, { fontSize: 14, marginBottom: 2 }]}>
            No places available for selected dates!
          </Text>
        )}
        <TouchableOpacity onPress={() => setVisible(true)}>
          <View
            style={[
              styles.inputContainer,
              {
                borderWidth: error === "Select a date!" ? 1 : 0,
                borderColor: GlobalColors.colors.pink500,
              },
            ]}
          >
            <Feather
              name="calendar"
              size={15}
              color={GlobalColors.colors.gray10}
              style={{ marginHorizontal: 5, marginRight: 10, top: 3 }}
            />
            <Text placeholder="Select dates..." style={styles.textInput}>
              {selectedDate}
            </Text>
            <Feather
              color={GlobalColors.colors.blue500}
              size={17}
              name="edit-3"
              style={{ position: "absolute", left: 325, top: 13 }}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { marginTop: 40, marginBottom: 5, fontSize: 14 },
          ]}
        >
          Select number of pets
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              left: 0,
              width: "40%",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <TouchableOpacity onPress={handleIncrement}>
            <Icon
              name="angle-up"
              style={[styles.icon]}
              size={15}
              color={GlobalColors.colors.darkGrey}
            />
          </TouchableOpacity>

          <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
            <MaterialCommunityIcon
              name="paw-outline"
              size={14}
              color={GlobalColors.colors.pink500}
              style={[styles.icon, { marginHorizontal: 2, top: 6, left: -4 }]}
            />
            <Text style={[styles.textInput, { alignSelf: "center", left: -4 }]}>
              {numberAnimals} {numberAnimals === 1 ? "pet" : "pets"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDecrement}>
            <Icon
              name="angle-down"
              style={[styles.icon]}
              color={GlobalColors.colors.darkGrey}
              size={15}
            />
          </TouchableOpacity>
        </View>
        {error === "Please fill in all animal information!" && (
          <Text
            style={[
              styles.title,
              { fontSize: 14, marginBottom: 2, marginTop: 18 },
            ]}
          >
            Please fill in all animal information!
          </Text>
        )}
        <View>{renderAnimalInputs()}</View>

        {visible && (
          <Modal visible={visible} animationType="slide">
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Ionicons
                    name="close-circle-outline"
                    color={GlobalColors.colors.pink500}
                    size={30}
                    style={{ left: -150, top: -20 }}
                  />
                </TouchableOpacity>
                {startDate && endDate && (
                  <Text
                    style={[styles.subtitle, { fontSize: 15, marginLeft: 0 }]}
                  >
                    {getAvailableSpots(startDate, endDate)} places available for
                    selected dates!
                  </Text>
                )}
                <View style={{ width: "100%" }}>
                  <Calendar
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    markingType={"period"}
                    minDate={getFormattedDate(new Date())}
                    theme={calendarTheme}
                  />
                </View>
                <Button
                  name="close-circle-outline"
                  textColor={GlobalColors.colors.pink500}
                  style={{
                    backgroundColor: GlobalColors.colors.gray0,
                    paddingHorizontal: 30,
                    top: 10,
                    alignSelf: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    elevation: 5,
                    shadowRadius: 4,
                  }}
                  size={30}
                  disabled={startDate != null && endDate != null ? false : true}
                  onPress={() => {
                    setSelectedDate(
                      `${moment(startDate).format("ddd, DD.MM")} - ${moment(
                        endDate
                      ).format("ddd, DD.MM")} `
                    );
                    setVisible(false);
                  }}
                >
                  Select
                </Button>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
      <View
        style={{
          backgroundColor: GlobalColors.colors.gray10,
          height: 80,
          justifyContent: "center",
        }}
      >
        <Button
          labelStyle={{ fontFamily: "Garet-Book" }}
          buttonColor={GlobalColors.colors.gray0}
          textColor={GlobalColors.colors.pink500}
          style={{
            width: 200,
            justifyContent: "center",
            alignSelf: "center",
            height: 40,
            borderWidth: error ? 1 : 0,
            borderColor: GlobalColors.colors.pink500,
          }}
          onPress={nextHandler}
        >
          Next
        </Button>
      </View>
    </>
  );
}
export default BookHotel;
const styles = StyleSheet.create({
  selectDatesTitle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 20,
    width: "80%",
    padding: 35,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
    shadowRadius: 4,
  },
  textInput: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 15,
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: GlobalColors.colors.gray0,
    height: 45,
    marginHorizontal: 30,
    padding: 10,
    flexDirection: "row",
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginLeft: 33,
    marginBottom: 20,
    marginTop: 5,
  },
  icon: {
    marginHorizontal: 0,
    top: 5,
    paddingHorizontal: 10,
  },
  checkBox: {
    backgroundColor: GlobalColors.colors.pink500,
    borderColor: GlobalColors.colors.gray0,
    textColor: GlobalColors.colors.blue500,
    width: 16,
    height: 16,
    marginHorizontal: 8,
    top: -24,
    borderRadius: 99999,
  },
  subtitle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 18,
    marginLeft: 33,
    marginBottom: 5,
  },
  checkBoxContainer: {
    backgroundColor: GlobalColors.colors.pink500,
    borderRadius: 10,
    height: 50,
    padding: 10,
    marginHorizontal: 30,
    marginVertical: 10,
  },
});
