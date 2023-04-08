import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import Input from "../components/Auth/Input";
import ButtonCustom from "../components/UI/ButtonCustom";
import { GlobalColors } from "../constants/colors";
import { useFonts } from "expo-font";
import { useState, useCallback } from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { createUser } from "../store/databases";
import * as SplashScreen from "expo-splash-screen";

function Register() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [fonts] = useFonts({
    Lora: require("../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../constants/fonts/Garet-Book.ttf"),
  });

  async function signupHandler({ name, email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(name, email, password);
      console.log(name);
      // authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not create your account. Please check your credentials or try again later!"
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
    return <LoadingOverlay message="Creating user ..." />;
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
        <Text style={styles.textView}>Create an account</Text>
        <RegisterForm onAuthenticate={signupHandler} />

        <View style={styles.linkContainer}>
          <Text style={styles.link}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text style={styles.linkPressed}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
export default Register;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: Dimensions.get("window").height / 2.9,
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
    marginTop: 5,
    fontFamily: "Garet-Book",
  },
  logoViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    // flex:1.5,
    backgroundColor: "white",
    bottom: 22,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },

  link: {
    color: GlobalColors.colors.pink10,
    fontWeight: "600",
  },
  linkPressed: {
    color: GlobalColors.colors.pink500,
    fontWeight: "800",
  },
  linkContainer: {
    flexDirection: "row",
    marginLeft: "27%",
    marginVertical: 4,
    paddingHorizontal: 4,
  },
});
