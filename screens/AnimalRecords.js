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
  });

  const route = useRoute();
  const [appointmentsDone, setAppointmentsDone] = useState([]);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();
  const [consultations, setConsultations] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [disinfestations, setDisinfestations] = useState([]);
  //   console.log(route.params);
  const [aid, setAid] = [route.params ? route.params.aid : null];
  //   console.log(aid);
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
    } else if (status === 2 && disinfestations.length > 0) {
      setMinYear(
        disinfestations.reduce(
          (min, appointment) => Math.min(min, appointment.date.split("-")[0]),
          Infinity
        )
      );

      setMaxYear(
        disinfestations.reduce(
          (max, appointment) => Math.max(max, appointment.date.split("-")[0]),
          -Infinity
        )
      );

      console.log(maxYear);
    }
  }, [status, vaccines, consultations, disinfestations]);
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

          setDisinfestations(
            resp.filter(
              (item) =>
                item.result.doctorReason.localeCompare("Disinfestation") === 0
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
            status={"Disinfestations"}
            count={disinfestations.length}
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
      {((status === 0 && consultations.length === 0) ||
        (status === 1 && vaccines.length === 0) ||
        (disinfestations.length === 0 && status === 2)) && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            top: -Dimensions.get("screen").width,
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
      <View style={styles.listContainer}>
        <FlatList
          data={
            status === 0
              ? consultations
              : status === 1
              ? vaccines
              : disinfestations
          }
          renderItem={({ item, index }) => {
            if (selectedYear) {
              if (item.date.split("-")[0].localeCompare(selectedYear) === 0) {
                return <MedicalRecordCard status={status} appointment={item} />;
              }
            } else {
              return <MedicalRecordCard status={status} appointment={item} />;
            }
          }}
          key={(item) => item.generatedId}
        />
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
    top: -450,
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
