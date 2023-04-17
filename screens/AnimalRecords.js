import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { getAnimalDoneAppointments } from "../store/databases";
import { AuthContext } from "../context/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import MedicalRecordCard from "../components/Appointments/MedicalRecordCard";
function AnimalRecords({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerStyle: { backgroundColor: "white" },
  });

  const route = useRoute();
  const [appointmentsDone, setAppointmentsDone] = useState([]);
  //   console.log(route.params);
  const [aid, setAid] = [route.params ? route.params.aid : null];
  //   console.log(aid);
  const [fetching, setFetching] = useState(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function getAppointments() {
      try {
        setFetching(true);
        let resp = [];
        resp = await getAnimalDoneAppointments(authCtx.uid, aid);
        // console.log(resp);
        setAppointmentsDone(resp);
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
      <View style={styles.listContainer}>
        <FlatList
          data={appointmentsDone}
          renderItem={({ item, index }) => (
            <MedicalRecordCard appointment={item} />
          )}
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
    top: 40,
  },
});
