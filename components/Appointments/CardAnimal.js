import { useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../../constants/colors";
import { getAge } from "../../util/date";

function AnimalCard({ animal, setCount, setId }) {
  const [pressed, setPressed] = useState(false);
  function onPress() {
    console.log(animal.id);
    !pressed ? setPressed(true) : setPressed(false);
    if (!pressed) {
      setCount((prevCount) => prevCount + 1),
        setId((prevAnimalIds) => [...prevAnimalIds, animal.aid]);
    } else {
      setCount((prevCount) => prevCount - 1),
        setId((prevAnimalIds) =>
          prevAnimalIds.filter((animalId) => animalId !== animal.aid)
        );
    }
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.cardContainer, pressed && styles.pressed]}>
        <View style={styles.itemsContainer}>
          <Image style={styles.image} source={{ uri: animal.photoUrl }}></Image>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.name}>{animal.name}</Text>
            <Text style={styles.date}>{animal.breed}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default AnimalCard;
const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  itemsContainer: {
    flexDirection: "row",
    width: "80%",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  cardContainer: {
    height: 100,
    marginHorizontal: 30,
    backgroundColor: GlobalColors.colors.white1,
    marginVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
  },
  name: {
    fontFamily: "Garet-Book",
    fontSize: 20,
    color: GlobalColors.colors.pink500,
    marginTop: 20,
    marginHorizontal: 20,
  },
  date: {
    fontFamily: "Garet-Book",
    fontSize: 10,
    color: GlobalColors.colors.darkGrey,

    marginHorizontal: 20,
  },
  pressed: {
    backgroundColor: GlobalColors.colors.gray0,
    borderWidth: 1,
    borderColor: GlobalColors.colors.pink100,
  },
});
