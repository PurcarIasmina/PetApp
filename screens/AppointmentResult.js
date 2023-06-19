import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useReducer } from "react";
import { GlobalColors } from "../constants/colors";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getAge } from "../util/date";
import DatePicker from "react-native-modern-datepicker";
import { getFormatedDate } from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PillCardPlan from "../components/Appointments/PillCardPlan";
import { editAppointment } from "../store/databases";
function AppointmentResult({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 20, top: 5 }}
        onPress={saveHandler}
      >
        <Ionicons
          name="save-outline"
          size={20}
          color={GlobalColors.colors.pink500}
        />
      </TouchableOpacity>
    ),
  });
  const route = useRoute();
  const [appointment, setAppointment] = useState(
    route.params.appointment ? route.params.appointment : null
  );
  console.log(appointment);

  const [selectedOption, setSelectedOption] = useState(
    route.params.selectedOption ? route.params.selectedOption : ""
  );
  const [diagnostic, setDiagnostic] = useState(
    route.params.diagnostic ? route.params.diagnostic : ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pills, setPills] = useState(
    route.params.pills ? route.params.pills : []
  );
  const [doses, setDoses] = useState(
    route.params.doses ? route.params.doses : []
  );
  console.log(pills);
  const optionsDate = { day: "numeric", month: "long", year: "numeric" };

  const [date, setDate] = useState(route.params.date ? route.params.date : "");
  const [reminder, setReminder] = useState(
    route.params.reminder ? route.params.reminder : false
  );

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  let currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  currentDate = new Date(romanianTime);
  const startDate = getFormatedDate(
    currentDate.setDate(currentDate.getUTCDate() + 1),
    "YYYY-MM-DD"
  );

  console.log(appointment.generatedId);
  const options = [
    { label: "Vaccine", value: "Vaccine" },
    { label: "Consultation", value: "Consultation" },
    { label: "Deworming", value: "Deworming" },
  ];
  function formatDate(dateString) {
    if (dateString) {
      const dateObj = new Date(dateString);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return dateObj.toLocaleDateString("en-US", options);
    } else return "";
  }
  const [isFocus, setIsFocus] = useState(false);
  console.log(Object(pills));
  async function saveHandler() {
    if (
      (selectedOption === "Consultation" &&
        (diagnostic.length != 0 || pills.length != 0)) ||
      (selectedOption != "Consultation" && doses.length != 0)
    ) {
      try {
        const resp = await editAppointment(appointment.generatedId, {
          aid: appointment.animal.aid,
          canceled: appointment.canceled,
          date: appointment.date,
          did: appointment.did,
          ownername: appointment.ownername,
          reason: appointment.reason,
          slot: appointment.slot,
          uid: appointment.uid,
          done: 1,
          canceled: 0,
          result: {
            doctorReason: selectedOption,
            nextAppointment: date.length > 0 ? date : undefined,
            diagnostic: diagnostic.length > 0 ? diagnostic : undefined,
            pillsPlan: pills.length > 0 ? pills : undefined,
            appointmentDoses: doses.length > 0 ? doses : undefined,
          },
        });
        if (!reminder) navigation.navigate("DoctorScreen");
        else navigation.navigate("DoctorReminders");
      } catch (error) {
        console.log(error);
      }
    }
  }
  function handlerDelete(index, moment) {
    pills[index].pillMomentDay[moment] = false;
    if (
      pills[index].pillMomentDay["Morning"] === false &&
      pills[index].pillMomentDay["Lunch"] === false &&
      pills[index].pillMomentDay["Evening"] === false
    )
      pills.splice(index, 1);
    forceUpdate();
  }
  function handlerDeleteDoses(index, moment) {
    doses.splice(index, 1);
    forceUpdate();
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.titleStyle, { color: GlobalColors.colors.pink500 }]}>
        Complete Appointment Result
      </Text>
      <KeyboardAwareScrollView
        style={[styles.detailsContainer, showDatePicker && { opacity: 0.2 }]}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text
          style={[styles.textStyle, { alignSelf: "center", marginTop: 10 }]}
        >
          {" "}
          Appointment details
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.cellStyle}>
            <Ionicons
              name="calendar-sharp"
              style={styles.icon}
              size={15}
              color={GlobalColors.colors.pink500}
            />
            <Text style={styles.textStyle}>{formatDate(appointment.date)}</Text>
          </View>
          <View style={styles.cellStyle}>
            <FontAwesome
              name={"clock-o"}
              style={styles.icon}
              size={16}
              color={GlobalColors.colors.pink500}
            />
            <Text style={styles.textStyle}>{appointment.slot}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.textStyle,
            { alignSelf: "center", top: 30, marginBottom: 30 },
          ]}
        >
          {" "}
          Animal details
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.cellStyle}>
            <Ionicons
              name="md-paw-sharp"
              style={styles.icon}
              size={14}
              color={GlobalColors.colors.pink500}
            />
            <Text style={styles.textStyle}>
              {appointment.animal.nameA}, {appointment.animal.breed}
            </Text>
          </View>
          <View style={styles.cellStyle}>
            <Ionicons
              name={"watch-sharp"}
              style={styles.icon}
              size={14}
              color={GlobalColors.colors.pink500}
            />
            <Text style={styles.textStyle}>
              {getAge(appointment.animal.date).years}y{" "}
              {getAge(appointment.animal.date).months}m{" "}
              {getAge(appointment.animal.date).days}d{" "}
            </Text>
          </View>
        </View>
        {/* <Text style={[styles.textStyle, { marginVertical: 20 }]}>
          Owner details
        </Text>
        <View style={styles.cellStyle}>
          <Ionicons
            name="person-circle-sharp"
            style={styles.icon}
            size={16}
            color={GlobalColors.colors.pink500}
          />
          <Text style={styles.textStyle}>{appointment.ownername}</Text>
        </View> */}
        <View>
          <Text style={[styles.textStyle, { marginTop: 30 }]}>
            Complete the following formular
          </Text>
        </View>
        <View style={{ position: "absolute", top: 210, left: 172 }}>
          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: GlobalColors.colors.pink500 },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownStyle}
            itemTextStyle={styles.dropdownTextStyle}
            data={options}
            search
            maxHeight={100}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Reason" : "..."}
            searchPlaceholder="Search..."
            value={selectedOption}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSelectedOption(item.label);
              setIsFocus(false);
            }}
          />

          {selectedOption != "Consultation" && selectedOption.length > 0 && (
            <View>
              <View style={styles.nextAppointmentContainerNoConsultation}>
                <Text style={styles.textStyle}>Recommend appointment</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(!showDatePicker)}
                >
                  <Ionicons
                    name="calendar-outline"
                    color={GlobalColors.colors.pink500}
                    size={20}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: GlobalColors.colors.pink500,
                      top: 5,
                      bottom: 5,
                    },
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </View>
              <View
                style={[
                  styles.addPillContainer,
                  {
                    left: -40,
                  },
                ]}
              >
                <Text style={styles.textStyle}>Add dose</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("DoseCardPlan", {
                      appointment: appointment,
                      selectedOption: selectedOption,
                      date: date,
                      doses: doses,
                    });
                  }}
                >
                  <Ionicons
                    name="add"
                    size={28}
                    color={GlobalColors.colors.pink500}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <View style={[styles.pillContainer, { top: -255, left: -72 }]}>
                  {doses.length > 0 && (
                    <View style={styles.pillItemContainer}>
                      <Text
                        style={[styles.textStyle, { fontSize: 17, left: -150 }]}
                      ></Text>
                      {doses.map((element, index) => (
                        <PillCardPlan
                          pillName={element.doseName}
                          pillTimes={element.doseNumber}
                          index={index}
                          handlerDelete={handlerDeleteDoses}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
          {selectedOption === "Consultation" && selectedOption.length > 0 && (
            <View>
              <View
                style={{
                  position: "absolute",
                  top: 2,
                  left: -130,
                }}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.textStyle]}
                    // multiline={true}
                    placeholder="Enter diagnostic"
                    placeholderTextColor={GlobalColors.colors.darkPurple}
                    placeholderStyle={styles.placeholderStyle}
                    textAlign="center"
                    onChangeText={(text) => setDiagnostic(text)}
                    value={diagnostic}
                    maxWidth={360}
                    multiline={true}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.nextAppointmentContainer}>
                    <Text style={styles.textStyle}>Recommend appointment</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(!showDatePicker)}
                    >
                      <Ionicons
                        name="calendar-outline"
                        color={GlobalColors.colors.pink500}
                        size={20}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color: GlobalColors.colors.pink500,
                          top: 5,
                          bottom: 5,
                        },
                      ]}
                    >
                      {formatDate(date)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.addPillContainer,
                      { left: -284, top: 120, height: 40 },
                    ]}
                  >
                    <Text style={styles.textStyle}>Add pill</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("AnimalPlan", {
                          appointment: appointment,
                          selectedOption: selectedOption,
                          date: date,
                          diagnostic: diagnostic,
                          pills: pills,
                        })
                      }
                    >
                      <Ionicons
                        name="add"
                        size={28}
                        color={GlobalColors.colors.pink500}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.pillContainer}>
                {pills.length > 0 &&
                  pills.some((item) => item.pillMomentDay.Morning === true) && (
                    <View style={styles.pillItemContainer}>
                      <Text
                        style={[styles.textStyle, { fontSize: 17, left: -150 }]}
                      >
                        Morning
                      </Text>
                      {pills.map(
                        (element, index) =>
                          element.pillMomentDay.Morning && (
                            <PillCardPlan
                              pillName={element.pillName}
                              pillTimes={element.pillTimes}
                              index={index}
                              handlerDelete={handlerDelete}
                              moment={"Morning"}
                            />
                          )
                      )}
                    </View>
                  )}
                {pills.length > 0 &&
                  pills.some((item) => item.pillMomentDay.Lunch === true) && (
                    <View style={styles.pillItemContainer}>
                      <Text
                        style={[styles.textStyle, { fontSize: 17, left: -150 }]}
                      >
                        Lunch
                      </Text>
                      {pills.map(
                        (element, index) =>
                          element.pillMomentDay.Lunch && (
                            <PillCardPlan
                              pillName={element.pillName}
                              pillTimes={element.pillTimes}
                              index={index}
                              handlerDelete={handlerDelete}
                              moment={"Lunch"}
                            />
                          )
                      )}
                    </View>
                  )}
                {pills.length > 0 &&
                  pills.some((item) => item.pillMomentDay.Evening === true) && (
                    <View style={styles.pillItemContainer}>
                      <Text
                        style={[styles.textStyle, { fontSize: 17, left: -150 }]}
                      >
                        Evening
                      </Text>
                      {pills.map(
                        (element, index) =>
                          element.pillMomentDay.Evening && (
                            <PillCardPlan
                              pillName={element.pillName}
                              pillTimes={element.pillTimes}
                              index={index}
                              handlerDelete={handlerDelete}
                              moment={"Evening"}
                            />
                          )
                      )}
                    </View>
                  )}
              </View>
            </View>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Ionicons
                  name="close-circle-outline"
                  color={GlobalColors.colors.pink500}
                  size={30}
                  style={{ left: -150, top: -20 }}
                />
              </TouchableOpacity>
              <DatePicker
                mode="calendar"
                selected={date}
                minimumDate={startDate}
                onDateChange={(propDate) => setDate(propDate)}
                options={{
                  backgroundColor: GlobalColors.colors.gray0,
                  textHeaderColor: GlobalColors.colors.pink500,
                  textDefaultColor: GlobalColors.colors.darkGrey,
                  selectedTextColor: "#fff",
                  mainColor: GlobalColors.colors.pink500,
                  textSecondaryColor: GlobalColors.colors.darkGrey,
                  borderColor: GlobalColors.colors.darkGrey,
                }}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
}
export default AppointmentResult;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.colors.white1,
  },
  titleStyle: {
    fontFamily: "Garet-Book",
    top: 120,
    alignSelf: "center",
    fontSize: 20,
    color: GlobalColors.colors.darkGrey,
  },
  detailsContainer: {
    backgroundColor: "white",
    height: 500,
    top: 150,
    borderRadius: 20,
    // marginHorizontal: 30,
    // alignItems: "center",
    borderWidth: 1,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    borderBottomWidth: 0,
    borderColor: GlobalColors.colors.white1,
    flex: 1,
  },
  textStyle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkPurple,
    fontSize: 14,
  },
  modal: {
    alignSelf: "center",
    backgroundColor: GlobalColors.colors.white1,
    alignSelf: "center",
    height: 120,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    // position: "relative",
    borderRadius: 10,
    marginLeft: -10,
    marginTop: -5,
    zIndex: 99999,
  },
  closeButtonView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    with: 40,
  },
  dropdown: {
    height: 40,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginHorizontal: -145,
    fontSize: 12,
    width: 375,
    marginTop: -5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: GlobalColors.colors.white1,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
  },
  placeholderStyle: {
    fontSize: 12,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    alignSelf: "center",
  },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    alignItems: "center",
  },
  iconStyle: {
    width: 12,
    height: 12,
  },
  inputSearchStyle: {
    height: 22,
    fontSize: 12,
    fontFamily: "Garet-Book",
    backgroundColor: "white",
    borderRadius: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: GlobalColors.colors.gray1,
    color: GlobalColors.colors.pink500,
  },
  dropdownStyle: {
    fontFamily: "Garet-Book",
    fontSize: 12,
    color: GlobalColors.colors.pink500,
    width: 375,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
  },
  dropdownTextStyle: {
    fontFamily: "Garet-Book",
    fontSize: 12,
    color: GlobalColors.colors.pink500,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    top: 2.5,
  },
  cellStyle: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: GlobalColors.colors.gray0,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: "45%",
    alignSelf: "center",
    top: 10,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: GlobalColors.colors.gray0,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: 375,
    height: 50,
    top: 20,
    left: -15,
  },
  placeholderStyle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
  },
  addPillContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: 165,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    left: 90,
  },
  nextAppointmentContainer: {
    marginTop: 40,
    width: 375,
    height: 80,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    left: -14,
  },
  nextAppointmentContainerNoConsultation: {
    marginTop: 40,
    width: 375,
    height: 80,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    left: -145,
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
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
    shadowRadius: 4,
  },
  pillContainer: {
    marginTop: 250,
  },
  pillItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -150,
    flexDirection: "column",
  },
});
