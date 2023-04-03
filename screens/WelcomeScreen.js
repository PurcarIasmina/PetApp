import { Text, Image, View, StyleSheet, Dimensions } from "react-native";
import Button from "../components/UI/ButtonCustom";
import { GlobalColors } from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
function WelcomeScreen({ navigation }) {
  function handlerRegister() {
    navigation.navigate("RegisterIn");
  }
  function handlerLogin() {
    navigation.navigate("LogIn");
  }
  return (
    <View style={styles.screen}>
      <Image
        resizeImage="center"
        style={styles.logo}
        source={require("../images/logoo.png")}
      />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../images/welcomeLogo.png")}
          />
        </View>
        <Image style={styles.imageBin} source={require("../images/bin.png")} />
        <Image
          style={styles.imageFLower}
          source={require("../images/flower.png")}
        />
        <View style={styles.buttonContainer}>
          <Button color={GlobalColors.colors.pink10} onPress={handlerRegister}>
            New in?
          </Button>
          <Button color={GlobalColors.colors.pink10} onPress={handlerLogin}>
            Login
          </Button>
        </View>
      </View>
    </View>
  );
}
export default WelcomeScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    backgroundColor: "transparent",
    width: 350,
    height: "15%",
    marginTop: 5,
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 0,
    transform: [
      {
        translateX: 0,
      },
      {
        translateY: 0,
      },
      {
        rotate: "0deg",
      },
    ],
    backgroundColor: "white",
    left: 0,
    top: 0,
  },
  imageContainer: {
    position: "absolute",
    width: 375,
    height: 812,
    borderRadius: 0,
    overflow: "hidden",
    transform: [
      {
        translateX: 0,
      },
      {
        translateY: 0,
      },
      {
        rotate: "0deg",
      },
    ],
    backgroundColor: "white",
    left: 0,
    top: 0,
    right: "auto",
    bottom: "auto",
  },
  image: {
    position: "absolute",
    width: 256,
    height: 289,
    borderRadius: 0,
    opacity: 1,
    transform: [
      {
        translateX: 50,
      },
      {
        translateY: 25,
      },
      {
        rotate: "0deg",
      },
    ],
    backgroundColor: "transparent",
  },
  imageBin: {
    position: "absolute",
    width: 85,
    height: 52,
    borderRadius: 0,
    opacity: 1,
    transform: [
      {
        translateX: 235,
      },
      {
        translateY: 190,
      },
      {
        rotate: "0deg",
      },
    ],
    backgroundColor: "transparent",
  },
  imageFLower: {
    position: "absolute",
    width: 112,
    height: 145,
    borderRadius: 0,
    opacity: 1,
    transform: [
      {
        translateX: 285,
      },
      {
        translateY: 200,
      },
      {
        rotate: "0deg",
      },
    ],
    backgroundColor: "transparent",
  },
  buttonContainer: {
    marginHorizontal: 50,
    marginVertical: 10,
    paddingTop: 400,
  },
});
