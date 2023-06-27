import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { View, Image, ImageBackground, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../constants/colors";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { getDoctorDetails } from "../store/databases";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";

function DoctorProfile({ navigation }) {
  navigation.setOptions({
    headerShown: true,
    headerTransparent: true,
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",

          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,

            position: "absolute",
            right: 140,
          }}
        >
          Your profile
          <FontAwesome
            name="stethoscope"
            size={30}
            color={GlobalColors.colors.pink500}
          />
        </Text>
        <TouchableOpacity
          style={{ marginRight: 10, marginTop: 1, marginLeft: -7 }}
          onPress={() => {
            navigation.navigate("DoctorEditProfile", {
              fullname: fullname,
              gender: gender,
              description: description,
              birthday: birthday,
              telephone: telephone,
              photo: photo,
            });
          }}
        >
          <FontAwesome
            name="edit"
            size={22}
            color={GlobalColors.colors.pink500}
          />
        </TouchableOpacity>
      </View>
    ),
    headerBackground: () => (
      <BlurView tint={"dark"} intensity={20} style={StyleSheet.absoluteFill} />
    ),
  });
  const route = useRoute();
  const authCtx = useContext(AuthContext);
  const [photo, setPhoto] = useState(route.params ? route.params.photo : "");
  const [description, setDescription] = useState(
    route.params ? route.params.description : ""
  );
  const [gender, setGender] = useState(route.params ? route.params.gender : "");
  const [birthday, setBirthday] = useState(
    route.params ? route.params.birthday : ""
  );
  const [fullname, setFullName] = useState(
    route.params ? route.params.fullname : ""
  );
  const [telephone, setTelephone] = useState(
    route.params ? route.params.telephone : ""
  );
  const [fetching, setFetching] = useState(false);
  if (!route.params) {
    useEffect(() => {
      async function getDetails() {
        try {
          setFetching(true);
          const resp = await getDoctorDetails(authCtx.uid);
          console.log(resp);
          if (resp) {
            setPhoto(resp.photo);
            setFullName(resp.fullname);
            setGender(resp.gender);
            setBirthday(resp.datebirth);
            setTelephone(resp.telephone);
            setDescription(resp.description);
          } else {
            navigation.navigate("DoctorEditProfile");
          }
          setFetching(false);
        } catch (error) {
          console.log(error);
        }
      }

      getDetails();
    }, []);
  }
  if (fetching) return <LoadingOverlay message={"Loading..."}></LoadingOverlay>;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.imageStyle}
          source={photo.length > 0 ? { uri: photo } : null}
        ></ImageBackground>
      </View>
      <View style={styles.userPictureContainer}>
        <Image
          source={photo.length > 0 ? { uri: photo } : null}
          style={styles.userPicture}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Ionicons
            size={17}
            color={GlobalColors.colors.pink500}
            name="person"
            style={styles.icon}
          />
          <Text style={styles.detail}>{fullname}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome
            name="venus-mars"
            size={17}
            color={GlobalColors.colors.pink500}
            style={styles.icon}
          ></FontAwesome>

          <Text style={styles.detail}>{gender}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome
            name="calendar-o"
            style={styles.icon}
            color={GlobalColors.colors.pink500}
            size={17}
          />

          <Text style={styles.detail}>{birthday}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome
            name="phone-square"
            color={GlobalColors.colors.pink500}
            style={styles.icon}
            size={18}
          />
          <Text style={styles.detail}>{telephone}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
}
export default DoctorProfile;
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: 300,
    width: "100%",
    borderColor: GlobalColors.colors.pink500,
  },
  imageStyle: {
    height: 400,
    opacity: 0.4,
  },
  userPictureContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    top: -50,
    borderEndWidth: 0.7,
    borderColor: GlobalColors.colors.pink500,
  },

  userPicture: {
    height: 230,
    width: 230,
    borderRadius: 115,
  },
  infoContainer: {
    marginTop: -9,
    alignSelf: "center",
    height: 290,
    width: "80%",
    borderRadius: 30,
    top: 40,
  },
  detail: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  iconGender: {
    top: 10,
    left: -10,
  },
  detailContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    padding: 20,

    borderRadius: 10,
    height: 110,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
  },
  icon: {
    marginTop: 10,
  },
  description: {
    color: GlobalColors.colors.pink500,
    fontFamily: "KohinoorDevanagari-Light",
  },
});
