import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { getAge } from "../../util/date";
import Swipeable from "react-native-gesture-handler/Swipeable";
import LoadingOverlay from "../UI/LoadingOverlay";
import { deleteAnimal } from "../../store/databases";
import { useState } from "react";
function PetElement({ animal, setDeleting }) {
  const navigation = useNavigation();
  const [fetching, setFetching] = useState(false);
  function onPressHandler() {
    navigation.navigate("PetScreen", {
      name: animal.name,
      breed: animal.breed,
      datebirth: animal.date,
      owner: animal.owner,
      color: animal.color,
      gender: animal.gender,
      photo: animal.photoUrl,
      aid: animal.aid,
      generatedId: animal.generatedId,
    });
  }

  async function onDelete() {
    setFetching(true);
    await deleteAnimal(animal.generatedId);
    setDeleting(true);
    setFetching(false);
  }

  function renderRightActions() {
    return (
      <View
        style={{
          margin: 0,
          alignContent: "center",
          justifyContent: "center",
          width: 80,

          borderRadius: 30,
        }}
      >
        <Ionicons name="trash" size={40} color="white" onPress={onDelete} />
      </View>
    );
  }

  if (!animal || fetching) {
    return <LoadingOverlay message="Loading..." />;
  }
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      // onSwipeableOpen={() => closeRow(index)}
      // ref={(ref) => (row[index] = ref)}
      rightOpenValue={-100}
    >
      <TouchableOpacity onPress={onPressHandler}>
        <View style={styles.elementContainer}>
          <View
            style={{
              maxHeight: 100,
              overflow: "hidden",
              borderRadius: 30,
              alignSelf: "center",
            }}
          >
            <Image style={styles.image} source={{ uri: animal.photoUrl }} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{animal.name}</Text>
            <Text style={styles.date}>{animal.date}</Text>
            <Text style={styles.date}>{`${getAge(animal.date).years}y ${
              getAge(animal.date).months
            }m ${getAge(animal.date).days}d`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
export default PetElement;
const styles = StyleSheet.create({
  elementContainer: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 30,
    shadowColor: GlobalColors.colors.pink500,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    height: 120,
    width: 350,
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginHorizontal: 15,
    alignSelf: "center",
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    fontFamily: "Roboto",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "900",
    color: GlobalColors.colors.gray10,
    paddingHorizontal: 10,
    fontFamily: "Garet-Book",
  },
});
