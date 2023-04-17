import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { GlobalColors } from "../constants/colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
function DoseCardPlan({ navigation }) {
  const route = useRoute();
  navigation.setOptions({
    headerStyle: {
      backgroundColor: "#fff",
    },
  });
  const [doseName, setDoseName] = useState("");
  const [doseQuantity, setDoseQuantity] = useState(0);
  const [checkedItems, setCheckedItems] = useState("");
  const [doseNumber, setDoseNumber] = useState("");

  const handleCheck = (text) => {
    setCheckedItems(text);
  };

  const [additionalInfo, setAdditionalInfo] = useState("");
  const handleIncrement = () => {
    setDoseQuantity(doseQuantity + 1);
  };

  const handleDecrement = () => {
    if (doseQuantity > 0) {
      setDoseQuantity(doseQuantity - 1);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Dose Plan</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Dose name</Text>
          <View style={styles.pillInputContainer}>
            <Icon
              style={[styles.icon, { marginLeft: 5, top: 5 }]}
              name={"receipt"}
              size={15}
              color={GlobalColors.colors.pink500}
            />
            <TextInput
              placeholder="Enter dose name..."
              style={styles.textInput}
              value={doseName}
              onChangeText={(text) => setDoseName(text)}
            ></TextInput>
          </View>
          <View style={styles.prescriptionContainer}>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: 15,
                  position: "absolute",
                  left: 3,
                  top: -20,
                },
              ]}
            >
              Dose quantity
            </Text>

            <View
              style={[
                styles.pillInputContainer,
                { marginLeft: -155, width: "43%" },
              ]}
            >
              <TouchableOpacity onPress={handleIncrement}>
                <Icon
                  name="angle-up"
                  style={[styles.icon, { marginHorizontal: -10 }]}
                  size={15}
                  color={GlobalColors.colors.darkGrey}
                />
              </TouchableOpacity>

              <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
                <Icon
                  name="pills"
                  size={14}
                  color={GlobalColors.colors.pink500}
                  style={[styles.icon, { marginHorizontal: 2, top: 5 }]}
                />
                <Text style={[styles.textInput, { alignSelf: "center" }]}>
                  {doseQuantity} doses
                </Text>
              </View>
              <TouchableOpacity onPress={handleDecrement}>
                <Icon
                  name="angle-down"
                  style={[styles.icon, { marginHorizontal: 10 }]}
                  color={GlobalColors.colors.darkGrey}
                  size={15}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 55, flexDirection: "column" }}>
            <Text style={[styles.subtitle, { fontSize: 15 }]}>
              {" "}
              Way of admnistration
            </Text>
            <View View style={{ marginTop: 5, left: 5, flexDirection: "row" }}>
              <Text style={[styles.subtitle, { fontSize: 15 }]}>Oral</Text>
              <Checkbox
                style={styles.checkBox}
                value={checkedItems === "Oral"}
                onValueChange={() => handleCheck("Oral")}
                color={GlobalColors.colors.pink500}
              />
              <Text style={[styles.subtitle, { fontSize: 15 }]}>
                Injectable
              </Text>
              <Checkbox
                style={styles.checkBox}
                value={checkedItems === "Injectable"}
                onValueChange={() => handleCheck("Injectable")}
                color={GlobalColors.colors.pink500}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.subtitle, { fontSize: 15 }]}>Lot number</Text>
            <View style={styles.pillInputContainer}>
              <Icon
                style={[styles.icon, { marginLeft: 5, top: 5 }]}
                name={"receipt"}
                size={15}
                color={GlobalColors.colors.pink500}
              />
              <TextInput
                placeholder="Enter doses lot number..."
                style={styles.textInput}
                value={doseNumber}
                onChangeText={(text) => setDoseNumber(text)}
              ></TextInput>
            </View>
          </View>
          <View>
            <Text style={[styles.subtitle, { top: 30, left: 5, fontSize: 16 }]}>
              Additional notes
            </Text>
            <View style={styles.additionalNotesContainer}>
              <TextInput
                placeholder="e.g. What to do next..."
                style={styles.textInput}
                value={additionalInfo}
                onChangeText={(text) => setAdditionalInfo(text)}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AppointmentResult", {
              doseDetails: {
                doseName: doseName,
                doseQuantity: doseQuantity,
                doseNumber: doseNumber,
                additionalInfo: additionalInfo,
              },
              doses: [
                ...route.params.doses,
                {
                  doseName: doseName,
                  doseQuantity: doseQuantity,
                  doseNumber: doseNumber,
                  additionalInfo: additionalInfo,
                },
              ],
              appointment: route.params.appointment,
              selectedOption: route.params.selectedOption,
              date: route.params.date,
            })
          }
        >
          <Button
            buttonColor={GlobalColors.colors.gray0}
            textColor={GlobalColors.colors.pink500}
            style={{
              paddingHorizontal: 20,
              width: 200,
            }}
          >
            Add dose
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default DoseCardPlan;
const styles = StyleSheet.create({
  container: { flex: 1, top: 10, backgroundColor: "white" },
  title: {
    fontSize: 24,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    marginLeft: 33,
  },
  pillContainer: {
    marginTop: 10,
    justifyContent: "center",
  },
  pillInputContainer: {
    borderRadius: 10,
    backgroundColor: GlobalColors.colors.gray0,
    height: 45,
    marginHorizontal: 30,
    padding: 10,
    flexDirection: "row",
    marginTop: 10,
  },
  pillImage: {
    height: 40,
    width: 40,
  },
  icon: {
    marginHorizontal: 10,
    top: 3,
    paddingHorizontal: 10,
  },
  textInput: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 15,
  },
  subtitle: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    fontSize: 18,
    marginLeft: 33,
    marginBottom: 5,
  },
  prescriptionContainer: {
    flexDirection: "row",
    top: 35,
    justifyContent: "center",
  },
  timePrescriptionContainer: {
    marginTop: 60,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  mealTime: {
    backgroundColor: GlobalColors.colors.gray0,
    height: 100,
    width: 100,
    borderRadius: 10,
    marginHorizontal: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mealTimeText: {
    fontSize: 12.5,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
    top: 3,
  },
  pressed: {
    backgroundColor: GlobalColors.colors.gray1,
  },
  additionalNotesContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    height: 150,
    marginHorizontal: 30,
    marginTop: 40,
    borderRadius: 10,
    padding: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: -100,
  },
  checkBox: {
    textColor: GlobalColors.colors.gray1,
    width: 12,
    height: 12,
    marginHorizontal: 10,
    top: 5,
  },
});
