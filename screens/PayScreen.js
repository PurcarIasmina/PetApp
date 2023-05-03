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
import { Calendar, CalendarTheme } from "react-native-calendars";
import { useState, useContext } from "react";
import { GlobalColors } from "../constants/colors";
import { useEffect } from "react";
import { getFormattedDate } from "../util/date";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import Checkbox from "expo-checkbox";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/auth";
import { addReservation } from "../store/databases";
function PayScreen({ navigation }) {
  const route = useRoute();
  console.log(route.params);
  const moment = require("moment");

  let daysDifference = 1;
  if (route.params.endDate) {
    const startDate = moment(route.params.startDate, "YYYY-MM-DD");
    const endDate = moment(route.params.endDate, "YYYY-MM-DD");
    daysDifference = endDate.diff(startDate, "days");
  }
  const authCtx = useContext(AuthContext);
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
      setEmailInvalid(false);
      setNameInvalid(false);
      setPhoneInvalid(false);
      setCheckInvalid(false);
      stateUpdater("");
    }, 5000);
  }
  function emailValidation(value) {
    const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return reg.test(value);
  }
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [checkInvalid, setCheckInvalid] = useState(false);
  const handleCheck = (text) => {
    setCheckedItems(text);
  };
  const handleNameChange = (value) => {
    setName(value);
  };
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePhoneChange = (value) => {
    setPhone(value);
  };
  function handlerValidation() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setNameInvalid(true);
      setEmailInvalid(true);
      setPhoneInvalid(true);
      return updateError("All fields are required!", setError);
    }
    if (!emailValidation(email)) {
      setEmailInvalid(true);
      return updateError("Invalid email!", setError);
    }

    if (checkedItems === "") {
      setCheckInvalid(true);
      return updateError("Check payment method!", setError);
    }

    return true;
  }
  async function submitHandler() {
    if (handlerValidation()) {
      try {
        const resp = await addReservation(
          name,
          route.params.animals,
          route.params.endDate ? route.params.endDate : "",
          route.params.startDate,
          checkedItems,
          email,
          phone,
          100 * route.params.animals.length * daysDifference,
          authCtx.uid
        );
        navigation.navigate("UserReservations");
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Text style={styles.title}>Enter your details</Text>
        {error !== "Check payment method!" && error.length > 0 && (
          <Text
            style={[
              styles.title,
              { fontSize: 14, marginBottom: 2, marginTop: 18 },
            ]}
          >
            {error}
          </Text>
        )}
        <View
          style={{
            marginTop: 20,
            backgroundColor: GlobalColors.colors.gray1,
            height: 300,
            borderRadius: 10,
            marginHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          <Text style={styles.subtitle}>Name</Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: GlobalColors.colors.pink500,
                borderWidth: nameInvalid ? 1 : 0,
              },
            ]}
          >
            <TextInput
              placeholder="Enter your fullname"
              style={styles.textInput}
              value={name}
              onChangeText={(value) => handleNameChange(value)}
            ></TextInput>
          </View>
          <Text style={styles.subtitle}>Phone</Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: GlobalColors.colors.pink500,
                borderWidth: phoneInvalid ? 1 : 0,
              },
            ]}
          >
            <TextInput
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={(value) => handlePhoneChange(value)}
              style={styles.textInput}
            ></TextInput>
          </View>
          <Text style={styles.subtitle}>Email</Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: GlobalColors.colors.pink500,
                borderWidth: emailInvalid ? 1 : 0,
              },
            ]}
          >
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => handleEmailChange(value)}
              autoCorrect={false}
              autoCapitalize={"none"}
              style={[styles.textInput, { textTransform: "lowercase" }]}
            ></TextInput>
          </View>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.title}>Total to pay (100 lei/day)</Text>
          <View style={{ top: 10, marginHorizontal: 5 }}>
            <Text style={styles.subtitle}>
              Number of days:{" "}
              <Text
                style={{ color: GlobalColors.colors.blue500, fontSize: 15 }}
              >
                {daysDifference}
              </Text>
            </Text>
            <Text style={styles.subtitle}>
              Number of animals:{" "}
              <Text
                style={{ color: GlobalColors.colors.blue500, fontSize: 15 }}
              >
                {route.params.animals.length}
              </Text>
            </Text>
            <View
              style={{
                borderTopWidth: 1,
                marginHorizontal: 30,
                top: 10,
                borderColor: GlobalColors.colors.gray10,
              }}
            >
              <Text
                style={{
                  color: GlobalColors.colors.blue500,
                  fontSize: 19,
                  left: 5,
                  top: 5,
                }}
              >
                {100 * route.params.animals.length * daysDifference} lei
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10, flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.title]}>Payment method</Text>
            <MaterialCommunityIcon
              name="contactless-payment-circle"
              color={GlobalColors.colors.blue500}
              size={18}
              style={{ top: 24, marginHorizontal: 4 }}
            />
          </View>
          {error === "Check payment method!" && error.length > 0 && (
            <Text
              style={[
                styles.title,
                { fontSize: 14, marginBottom: 2, marginTop: 18 },
              ]}
            >
              {error}
            </Text>
          )}
          <View style={styles.checkBoxContainer}>
            <Text
              style={[
                styles.subtitle,
                { fontSize: 17, color: GlobalColors.colors.gray0 },
              ]}
            >
              Pay at arrival
            </Text>
            <Checkbox
              style={styles.checkBox}
              value={checkedItems === "Arrival"}
              onValueChange={() => handleCheck("Arrival")}
              color={GlobalColors.colors.pink10}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            <Text
              style={[
                styles.subtitle,
                { fontSize: 17, color: GlobalColors.colors.gray0 },
              ]}
            >
              Pay now
            </Text>
            <Checkbox
              style={styles.checkBox}
              value={checkedItems === "Now"}
              onValueChange={() => handleCheck("Now")}
              color={GlobalColors.colors.pink10}
            />
          </View>
        </View>
      </View>
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
          }}
          onPress={submitHandler}
        >
          Submit
        </Button>
      </View>
    </>
  );
}
export default PayScreen;
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
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginLeft: 37,

    marginTop: 20,
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
    fontSize: 14,
    marginLeft: 33,
    marginBottom: 2,
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
