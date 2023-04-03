import { Text, Image, StyleSheet, View } from "react-native";
import { useContext, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Headline } from "react-native-paper";
import { GlobalColors } from "../constants/colors";
import { useLayoutEffect } from "react";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import DoctorCard from "../components/Appointments/DoctorCard";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { getDoctorsList } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { GestureHandlerScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreenUser({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [fetching, setFetching] = useState(false);
  let doctorsAux;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
    }),
      [navigation];
  });
  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fonts) {
      await SplashScreen.hideAsync();
    }
  }, [fonts]);
  useEffect(() => {
    async function getDoctors() {
      try {
        setFetching(true);
        doctorsAux = await getDoctorsList();
        setDoctors(doctorsAux);
        console.log(doctors);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }

    getDoctors();
  }, []);

  if (!fonts) {
    return null;
  }
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  const renderItem = ({ item, index }) => {
    if (doctors.length % 2 === 1 && index === doctors.length - 1) {
      return <DoctorCard doctor={item} left={"impar"} />;
    } else {
      return <DoctorCard doctor={item} />;
    }
  };
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.banner}>
        <View style={styles.headerContainer}>
          <Headline style={styles.header}>
            Welcome Back, {authCtx.name}!
          </Headline>
        </View>
        <View
          style={{
            borderRadius: 110,
            borderColor: GlobalColors.colors.pink1,
            marginHorizontal: 50,
            borderWidth: 1,
            height: 220,
            width: 220,
            alignSelf: "center",
            backgroundColor: "white",
          }}
        >
          <Image
            style={styles.image}
            source={require("../images/userpage.png")}
            resizeMode="center"
          ></Image>
        </View>
      </View>
      <View style={[styles.headerContainer, { marginTop: 100 }]}>
        <Text style={[styles.header, { marginTop: 5 }]}>Our team</Text>
      </View>
      <View style={styles.docContainer}>
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={(item) => item.did}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}
export default HomeScreenUser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.colors.white1,
  },
  image: {
    height: 200,
    alignSelf: "center",
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  banner: {
    marginTop: 90,
    height: 200,
    width: "100%",
  },
  header: {
    color: GlobalColors.colors.pink1,
    alignSelf: "center",
    fontFamily: "Garet-Book",
    fontSize: 19,
  },
  headerContainer: {
    borderRadius: 30,
    height: 40,
    backgroundColor: GlobalColors.colors.pink10,
    marginHorizontal: 40,
    marginVertical: 10,
  },
  petsContaienr: {
    marginTop: 100,
  },
  docContainer: {
    // justifyContent: "center",
    top: 20,
    alignItems: "center",
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  list: {
    flexGrow: 1,
  },
});
