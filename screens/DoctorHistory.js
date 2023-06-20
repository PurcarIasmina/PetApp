import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  SectionList,
} from "react-native";
import { AuthContext } from "../context/auth";
import { getDoctorAllAppointments, getUserDetails } from "../store/databases";
import AppointmentHistoryCard from "../components/Appointments/AppointmentHistoryCard";
import { GlobalColors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { LinearGradient } from "expo-linear-gradient";

function DoctorHistory({ navigation }) {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: "white",
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
    headerRight: () => (
      <Text style={styles.headerText}>Appointments archive</Text>
    ),
  });
  const authCtx = useContext(AuthContext);
  const [app, setApp] = useState([]);
  const [filteredApp, setFilteredApp] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [docDetails, setDocDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    async function getAllAppointments() {
      setFetching(true);
      let resp = [];
      resp = await getDoctorAllAppointments(authCtx.uid);
      setApp(resp);
      setFilteredApp(resp);
      setFetching(false);
    }
    getAllAppointments();
  }, []);

  useEffect(() => {
    async function getDocNm() {
      try {
        setFetching(true);
        const resp = await getUserDetails(authCtx.uid);
        setDocDetails(resp);

        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getDocNm();
  }, []);
  const filterNames = (text) => {
    const filtered = app.filter((item) => {
      return (
        item.animal.nameA
          .toLowerCase()
          .trim()
          .indexOf(text.toLowerCase().trim()) > -1
      );
    });
    setFilteredApp(filtered);
    setTextSearch(text);
  };
  if (fetching) return <LoadingOverlay message="Loading..." />;
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[GlobalColors.colors.red1, GlobalColors.colors.pink500]}
        style={styles.searchBar}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
      >
        <Ionicons
          style={styles.searchIcon}
          color={"white"}
          size={16}
          name={"search-outline"}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Search by animal name"
          placeholderTextColor={"white"}
          value={textSearch}
          onChangeText={(text) => filterNames(text)}
        ></TextInput>
      </LinearGradient>
      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={true}
      >
        {filteredApp.some(
          (item) => item.result.doctorReason === "Consultation"
        ) && (
          <>
            <Text style={styles.category}>Consultations</Text>
            {filteredApp
              .filter((item) => item.result.doctorReason === "Consultation")
              .map((item) => (
                <AppointmentHistoryCard
                  appointment={item}
                  docDetails={docDetails}
                />
              ))}
          </>
        )}
        {filteredApp.some((item) => item.result.doctorReason === "Vaccine") && (
          <>
            <Text style={styles.category}>Vaccines</Text>
            {filteredApp
              .filter((item) => item.result.doctorReason === "Vaccine")
              .map((item) => (
                <AppointmentHistoryCard
                  appointment={item}
                  docDetails={docDetails}
                />
              ))}
          </>
        )}
        {filteredApp.some(
          (item) => item.result.doctorReason === "Deworming"
        ) && (
          <>
            <Text style={styles.category}>Dewormings</Text>
            {filteredApp
              .filter((item) => item.result.doctorReason === "Deworming")
              .map((item) => (
                <AppointmentHistoryCard
                  appointment={item}
                  docDetails={docDetails}
                />
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
export default DoctorHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBar: {
    height: 45,
    marginHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  searchIcon: {
    marginRight: 5,
  },
  inputStyle: {
    color: "white",
    fontFamily: "Garet-Book",
    fontSize: 15,
  },
  scrollView: {
    maxHeight: 700,
  },
  category: {
    fontSize: 18,
    color: GlobalColors.colors.pink500,
    marginLeft: 25,
    fontFamily: "Garet-Book",
    marginVertical: 10,
  },
  headerText: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    fontSize: 17.5,
    left: -113,
    textShadowColor: "red",
    textShadowRadius: 1,
  },
});
