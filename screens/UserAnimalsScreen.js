import { Text, View, StyleSheet, Dimensions, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import PetElement from "../components/PetCard/PetElement";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalColors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { getUsersAnimals } from "../store/databases";
import { AuthContext } from "../context/auth";
import { useContext } from "react";
import LoadingOverlay from "../components/UI/LoadingOverlay";
function UserAnimalsScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [animalsFetching, setAnimalsFetching] = useState(false);
  const [animals, setAnimals] = useState([]);
  let animalss;
  let screen = null;
  navigation.setOptions({
    headerStyle: {
      backgroundColor: GlobalColors.colors.pink1,
      elevation: 0,
      shadowOpacity: 0,
    },
  });

  useEffect(() => {
    async function getAnimals() {
      try {
        setAnimalsFetching(true);
        console.log(authCtx.uid);
        animalss = await getUsersAnimals(authCtx.uid);
        console.log(animalss);
        setAnimals(animalss);
      } catch (error) {
        console.log(error);
      }
      setAnimalsFetching(false);
    }
    getAnimals();
  }, []);
  //    const getAnimals = async ()=>{
  //     try{
  //     setAnimalsFetching(true)
  //     const animalss = await getUsersAnimals(authCtx.uid)
  //     setAnimals(animalss)

  //     }catch(error)
  //     {
  //         console.log(error)
  //     }
  //     setAnimalsFetching(false)

  // }
  if (animalsFetching) {
    return <LoadingOverlay message="Loading your pet friends" />;
  }
  if (animals.length === 0) {
    navigation.setOptions({
      headerRight: () => {
        return;
      },
    });
    screen = (
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>No pets registered yet!</Text>
          <Text style={styles.text}>
            Register your pet and join in our community!
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("AddPetScreen")}>
            <Ionicons
              name="add-circle-outline"
              size={100}
              color={GlobalColors.colors.pink500}
            />
          </TouchableOpacity>
          <Text style={styles.text}> Add a pet</Text>
        </View>
      </View>
    );
  } else {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => navigation.navigate("AddPetScreen")}
        >
          <Ionicons
            name="add-circle-outline"
            size={25}
            color={GlobalColors.colors.pink500}
          />
        </TouchableOpacity>
      ),
    });
    screen = (
      <FlatList
        data={animals}
        renderItem={({ item }) => {
          return <PetElement animal={{ ...item }} />;
        }}
        keyExtractor={(item) => item.aid}
      ></FlatList>
    );
  }

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={
        animals.length != 0
          ? [GlobalColors.colors.pink1, GlobalColors.colors.pink1]
          : [
              GlobalColors.colors.pink1,
              GlobalColors.colors.pink10,
              GlobalColors.colors.pink500,
            ]
      }
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {screen}
      </View>
    </LinearGradient>
  );
}
export default UserAnimalsScreen;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Dimensions.get("window").height / 5,
    backgroundColor: "white",
    width: 300,
    height: 200,
    margin: 45,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    fontSize: 15,
    fontFamily: "Garet-Book",
    textAlign: "center",
    color: GlobalColors.colors.pink500,
  },
  textContainer: {
    marginTop: 50,
  },
});
