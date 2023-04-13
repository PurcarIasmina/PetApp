import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { GlobalColors } from "../constants/colors";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getAge } from "../util/date";
function AppointmentResult({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
  });
  const route = useRoute();
  const [appointment, setAppointment] = useState(
    route.params ? route.params : null
  );

  const [textInputWidth, setTextInputWidth] = useState(0);

  const [selectedOption, setSelectedOption] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [treatment, setTreatment] = useState("");

  const options = [
    { label: "Vaccine", value: "Vaccine" },
    { label: "Consultation", value: "Consultation" },
    { label: "Disinfestation", value: "Disinfestation" },
  ];
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {}, [selectedOption]);
  const onContentSizeChange = (event) => {
    // const { height } = event.nativeEvent.contentSize;
    const { width } = event.nativeEvent.contentSize;
    // setTextInputHeight(height);
    setTextInputWidth(width);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Complete Appointment Result</Text>
      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.textStyle,
            { alignSelf: "center", marginTop: 10, marginBottom: 10 },
          ]}
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
            <Text style={styles.textStyle}>{appointment.date}</Text>
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
            { alignSelf: "center", marginVertical: 20 },
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
        <Text style={[styles.textStyle, { marginVertical: 20 }]}>
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
        </View>
        <View>
          <Text style={[styles.textStyle, { marginTop: 40 }]}>
            Complete the following formular
          </Text>
        </View>
        <View style={{ position: "absolute", top: 320, left: 172 }}>
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
              <Text>Next appointment for {selectedOption}</Text>
            </View>
          )}
          {selectedOption === "Consultation" && selectedOption.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                top: 65,
                left: -150,
              }}
            >
              <Text
                style={[
                  styles.textStyle,
                  { position: "absolute", left: 34, top: -10 },
                ]}
              >
                Enter diagnostic
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.textStyle,
                    {
                      // height: Math.max(35, textInputHeight),
                      width: Math.max(150, textInputWidth),
                    },
                  ]}
                  multiline={true}
                  placeholder="Diagnostic"
                  placeholderTextColor={GlobalColors.colors.darkGrey}
                  placeholderStyle={styles.placeholderStyle}
                  onChangeText={(text) => setDiagnostic(text)}
                  onContentSizeChange={onContentSizeChange}
                  value={diagnostic}
                />
              </View>
            </View>
          )}
        </View>
      </View>
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
    padding: 15,
    // marginHorizontal: 30,
    alignItems: "center",
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
    marginBottom: 5,
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
    height: 25,
    borderColor: GlobalColors.colors.darkGrey,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginHorizontal: -70,
    fontSize: 12,
    width: 220,
    marginTop: 10,
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
  },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
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
    width: 220,
  },
  dropdownTextStyle: {
    fontFamily: "Garet-Book",
    fontSize: 12,
    color: GlobalColors.colors.pink500,
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
    width: 170,
    top: 20,
    marginHorizontal: 10,
  },
  placeholderStyle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
  },
});
