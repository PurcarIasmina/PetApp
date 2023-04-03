import { View, StyleSheet, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
function InfoLine({ name, info }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.info}>{info}</Text>
    </View>
  );
}

export default InfoLine;
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: GlobalColors.colors.pastel1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
  },
  name: {
    marginTop: 20,
    paddingLeft: 30,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: GlobalColors.colors.pink500,
  },
  info: {
    marginTop: 20,
    paddingHorizontal: 50,
    fontSize: 15,
    color: "gray",
  },
});
