import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Input from "../components/Auth/Input";
import ButtonCustom from "../components/UI/ButtonCustom";
import { GlobalColors } from "../constants/colors";
import { useFonts } from "expo-font";
import LoginForm from "../components/Auth/LoginForm";
import { addToken, getUserName, login } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { useState, useContext, useCallback, useRef, useEffect } from "react";
import { AuthContext } from "../context/auth";
import HomeScreenUser from "./HomeScreenUser";
import * as SplashScreen from "expo-splash-screen";
import { registerForPushNotificationsAsync } from "../notifications/notifications";

function doctorValidation(value) {
  const reg = /@doctor\.petapp\.ro/;
  return reg.test(value);
}
function Login({ navigation }) {
  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { token, id, name } = await login(email, password);
      authCtx.authenticate(token);

      // const addTk = await addToken(id);
      authCtx.userDetails(name, id);
      if (doctorValidation(email)) authCtx.checkIsDoctor("doctor");
      if (!authCtx.doctor) navigation.replace("HomeScreenUser");
      else navigation.replace("DoctorScreen");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authentication failed",
        "Could not log you in.Please check your credentials"
      );
      setIsAuthenticating(false);
    }
  }
  const onLayoutRootView = useCallback(async () => {
    if (fonts) {
      await SplashScreen.hideAsync();
    }
  }, [fonts]);

  if (!fonts) return null;

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in ..." />;
  }
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      onLayout={onLayoutRootView}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.image}
          source={require("../images/reg-removebg.png")}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.textView}>LOGIN</Text>
        <LoginForm onLogin={loginHandler} />
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.link}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterIn")}>
          <Text style={styles.linkPressed}>Register in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: Dimensions.get("window").height / 2.5,
    backgroundColor: GlobalColors.colors.pink1,
  },
  image: {
    height: undefined,
    width: "100%",
    backgroundColor: GlobalColors.colors.pink1,
    opacity: 0.9,
    aspectRatio: 1,

    transform: [
      {
        translateY: -40,
      },
    ],
  },
  textView: {
    color: GlobalColors.colors.pink10,
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Garet-Book",
    marginTop: 15,
  },
  logoViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  link: {
    color: GlobalColors.colors.pink10,
    fontWeight: "600",
  },

  linkContainer: {
    marginLeft: "20%",
    marginHorizontal: 1,
    flexDirection: "row",
  },
  linkPressed: {
    color: GlobalColors.colors.pink500,
    fontWeight: "800",
  },
  formContainer: {
    // flex:1.5,
    backgroundColor: "white",
    bottom: 22,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  formContainer: {
    // flex:1.5,
    backgroundColor: "white",
    bottom: 22,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
});
