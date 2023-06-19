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
function AnimalPlan({ navigation }) {
  const route = useRoute();
  navigation.setOptions({
    headerStyle: {
      backgroundColor: "#fff",
    },
  });
  const [pillName, setPillName] = useState("");
  const [pillCount, setPillCount] = useState(0);
  const [pillTimes, setPillTimes] = useState(0);
  const [pressed, setPressed] = useState({
    Morning: false,
    Lunch: false,
    Evening: false,
  });
  const [additionalInfo, setAdditionalInfo] = useState("");
  const handleIncrement = () => {
    setPillCount(pillCount + 1);
  };

  const handleDecrement = () => {
    if (pillCount > 0) {
      setPillCount(pillCount - 1);
    }
  };
  const handleDaysIncrement = () => {
    setPillTimes(pillTimes + 1);
  };

  const handleDaysDecrement = () => {
    if (pillTimes > 0) {
      setPillTimes(pillTimes - 1);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Animal Plan</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Pill name</Text>
          <View style={styles.pillInputContainer}>
            <Icon
              style={[styles.icon, { marginLeft: 5, top: 5 }]}
              name={"receipt"}
              size={15}
              color={GlobalColors.colors.pink500}
            />
            <TextInput
              placeholder="Enter pill name..."
              style={styles.textInput}
              value={pillName}
              onChangeText={(text) => setPillName(text)}
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
              How many
            </Text>
            <View style={[styles.pillInputContainer, { width: "40%" }]}>
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
                  style={[styles.icon, { marginHorizontal: 1 }]}
                />
                <Text style={[styles.textInput]}>{pillCount} tablets</Text>
              </View>
              <TouchableOpacity onPress={handleDecrement}>
                <Icon
                  name="angle-down"
                  style={[styles.icon, { marginHorizontal: -10 }]}
                  color={GlobalColors.colors.darkGrey}
                  size={15}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: 15,
                  position: "absolute",
                  left: 195,
                  top: -20,
                },
              ]}
            >
              How long
            </Text>
            <View
              style={[
                styles.pillInputContainer,
                { marginLeft: -10, width: "40%" },
              ]}
            >
              <TouchableOpacity onPress={handleDaysIncrement}>
                <Icon
                  name="angle-up"
                  style={[styles.icon, { marginHorizontal: -10 }]}
                  size={15}
                  color={GlobalColors.colors.darkGrey}
                />
              </TouchableOpacity>

              <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
                <Icon
                  name="calendar"
                  size={14}
                  color={GlobalColors.colors.pink500}
                  style={[styles.icon, { marginHorizontal: 2, top: 5 }]}
                />
                <Text style={[styles.textInput, { alignSelf: "center" }]}>
                  {pillTimes} days
                </Text>
              </View>
              <TouchableOpacity onPress={handleDaysDecrement}>
                <Icon
                  name="angle-down"
                  style={[styles.icon, { marginHorizontal: 10 }]}
                  color={GlobalColors.colors.darkGrey}
                  size={15}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timePrescriptionContainer}>
            <Text style={[styles.subtitle, { fontSize: 16 }]}>
              {" "}
              When to take
            </Text>
            <View style={styles.timeContainer}>
              <Pressable
                onPress={() => {
                  setPressed({
                    Morning: !pressed.Morning,
                    Lunch: pressed.Lunch,
                    Evening: pressed.Evening,
                  });
                }}
              >
                <View
                  style={[styles.mealTime, pressed.Morning && styles.pressed]}
                >
                  <MaterialCommunityIcon
                    name="coffee"
                    color={GlobalColors.colors.pink500}
                    size={40}
                  />
                  <Text style={styles.mealTimeText}>Morning</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setPressed({
                    Morning: pressed.Morning,
                    Lunch: !pressed.Lunch,
                    Evening: pressed.Evening,
                  });
                }}
              >
                <View
                  style={[styles.mealTime, pressed.Lunch && styles.pressed]}
                >
                  <MaterialCommunityIcon
                    name="food-variant"
                    color={GlobalColors.colors.pink500}
                    size={40}
                  />
                  <Text style={styles.mealTimeText}>Lunch</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setPressed({
                    Morning: pressed.Morning,
                    Lunch: pressed.Lunch,
                    Evening: !pressed.Evening,
                  });
                }}
              >
                <View
                  style={[styles.mealTime, pressed.Evening && styles.pressed]}
                >
                  <MaterialCommunityIcon
                    name="bed-empty"
                    color={GlobalColors.colors.pink500}
                    size={40}
                  />
                  <Text style={styles.mealTimeText}>Evening</Text>
                </View>
              </Pressable>
            </View>
            <Text style={[styles.subtitle, { top: 30, left: 5, fontSize: 16 }]}>
              Additional notes
            </Text>
            <View style={styles.additionalNotesContainer}>
              <TextInput
                placeholder="e.g. Take one tablet 3 times a day"
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
              pillDetails: {
                pillName: pillName,
                pillCount: pillCount,
                pillTimes: pillTimes,
                additionalInfo: additionalInfo,
                pillMomentDay: pressed,
              },
              pills: [
                ...route.params.pills,
                {
                  pillName: pillName,
                  pillCount: pillCount,
                  pillTimes: pillTimes,
                  additionalInfo: additionalInfo,
                  pillMomentDay: pressed,
                },
              ],
              appointment: route.params.appointment,
              selectedOption: route.params.selectedOption,
              date: route.params.date,
              diagnostic: route.params.diagnostic,
              reminder: route.params.reminder,
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
            Add pill
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default AnimalPlan;
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
});
