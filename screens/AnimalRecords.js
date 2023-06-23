import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";

import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { getAnimalDoneAppointments } from "../store/databases";
import { AuthContext } from "../context/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import MedicalRecordCard from "../components/Appointments/MedicalRecordCard";
import HeaderButtonAppointment from "../components/UI/HeaderButtonAppointment";
import { GlobalColors } from "../constants/colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
function AnimalRecords({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0,
      borderBottomColor: "white",
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 20, flexDirection: "row", top: 5 }}
        onPress={() => navigation.navigate("PetScreen", { ...route.params })}
      >
        <Feather
          name={"chevron-left"}
          color={GlobalColors.colors.pink500}
          size={15}
          style={{ top: 3, left: 2 }}
        />
        <Text
          style={{
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
            fontSize: 14,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    ),
  });

  const route = useRoute();
  const [appointmentsDone, setAppointmentsDone] = useState([]);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();
  const [consultations, setConsultations] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [dewormings, setDewormings] = useState([]);
  const [aid, setAid] = [route.params ? route.params.aid : null];
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearPressed, setPressed] = useState(false);
  const authCtx = useContext(AuthContext);
  useLayoutEffect(() => {
    if (status === 0 && consultations.length > 0) {
      setMinYear(
        consultations.reduce(
          (min, appointment) => Math.min(min, appointment.date.split("-")[0]),
          Infinity
        )
      );
      setMaxYear(
        consultations.reduce(
          (max, appointment) => Math.max(max, appointment.date.split("-")[0]),
          -Infinity
        )
      );
      console.log(maxYear);
    } else if (status === 1 && vaccines.length > 0) {
      setMinYear(
        vaccines.reduce(
          (min, appointment) => Math.min(min, appointment.date.split("-")[0]),
          Infinity
        )
      );

      setMaxYear(
        vaccines.reduce(
          (max, appointment) => Math.max(max, appointment.date.split("-")[0]),
          -Infinity
        )
      );

      console.log(maxYear);
    } else if (status === 2 && dewormings.length > 0) {
      setMinYear(
        dewormings.reduce(
          (min, appointment) => Math.min(min, appointment.date.split("-")[0]),
          Infinity
        )
      );

      setMaxYear(
        dewormings.reduce(
          (max, appointment) => Math.max(max, appointment.date.split("-")[0]),
          -Infinity
        )
      );

      console.log(maxYear);
    }
  }, [status, vaccines, consultations, dewormings]);
  useEffect(() => {
    async function getAppointments() {
      try {
        setFetching(true);
        let resp = [];
        resp = await getAnimalDoneAppointments(authCtx.uid, aid);
        console.log(resp);
        if (resp) {
          setVaccines(
            resp.filter(
              (item) => item.result.doctorReason.localeCompare("Vaccine") === 0
            )
          );

          setConsultations(
            resp.filter(
              (item) =>
                item.result.doctorReason.localeCompare("Consultation") === 0
            )
          );

          setDewormings(
            resp.filter(
              (item) =>
                item.result.doctorReason.localeCompare("Deworming") === 0
            )
          );
        }
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }

    getAppointments();
  }, []);

  if (fetching) return <LoadingOverlay message={"Loading..."} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableRipple
          onPress={() => {
            setStatus(0), setMinYear(), setMaxYear();
            setSelectedYear(null);
          }}
        >
          <HeaderButtonAppointment
            pressed={status === 0 ? "pressed" : null}
            status={"Consultations"}
            count={consultations.length}
            textSize={12}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setStatus(1);
            setMinYear(), setMaxYear();
            setSelectedYear(null);
          }}
        >
          <HeaderButtonAppointment
            pressed={status === 1 ? "pressed" : null}
            status={"Vaccines"}
            count={vaccines.length}
            textSize={12}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setStatus(2);
            setMinYear(), setMaxYear();
            setSelectedYear(null);
          }}
        >
          <HeaderButtonAppointment
            pressed={status === 2 ? "pressed" : null}
            status={"Dewormings"}
            count={dewormings.length}
            textSize={11.6}
          />
        </TouchableRipple>
      </View>
      <ScrollView style={{ flexDirection: "column" }} horizontal>
        {Array.from({ length: maxYear - minYear + 1 }, (_, index) => {
          const year = minYear + index;
          const isSelected = selectedYear === year;
          return (
            <TouchableOpacity
              key={year}
              onPress={() => {
                if (isSelected) {
                  setSelectedYear(null);
                  setPressed(false);
                } else {
                  setSelectedYear(year);
                  setPressed(true);
                }
              }}
            >
              <View
                style={[
                  styles.dateContianer,
                  isSelected && {
                    backgroundColor: GlobalColors.colors.gray10,
                  },
                ]}
              >
                <Text style={styles.dateText}>{year}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ position: "absolute", top: 100 }}>
        {((status === 0 && consultations.length === 0) ||
          (status === 1 && vaccines.length === 0) ||
          (dewormings.length === 0 && status === 2)) && (
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              left: 150,
              top: 200,
            }}
          >
            <Ionicons
              name={"calendar-outline"}
              color={GlobalColors.colors.gray10}
              size={40}
            />
            <Text
              style={{
                fontWeight: "600",
                fontSize: 20,
                color: GlobalColors.colors.gray10,
                marginRight: 3,
              }}
            >
              No Records
            </Text>
          </View>
        )}
        <ScrollView
          style={{ flexGrow: 1, overflow: "scroll", maxHeight: 700 }}
          bounces={false}
          showsVerticalScrollIndicator
        >
          {(data =
            status === 0
              ? consultations
              : status === 1
              ? vaccines
              : dewormings) &&
            data.map((item) => {
              if (selectedYear) {
                if (item.date.split("-")[0].localeCompare(selectedYear) === 0) {
                  return (
                    <MedicalRecordCard status={status} appointment={item} />
                  );
                }
              } else {
                return <MedicalRecordCard status={status} appointment={item} />;
              }
            })}
        </ScrollView>
      </View>
    </View>
  );
}
export default AnimalRecords;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
  },
  dateContianer: {
    marginTop: 10,
    backgroundColor: GlobalColors.colors.pink500,
    borderRadius: 15,
    justifyContent: "center",
    height: 30,
    width: 120,
    alignItems: "center",
    padding: 3,
  },
  dateText: {
    fontFamily: "Garet-Book",
    color: "white",
    fontSize: 13,
  },
});
