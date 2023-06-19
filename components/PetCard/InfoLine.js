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
    borderColor: GlobalColors.colors.gray0,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    backgroundColor: GlobalColors.colors.gray0,
    alignItems: "center",
    marginTop: 10,
    shadowColor: GlobalColors.colors.gray1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0.3,
    elevation: 5,
  },
  name: {
    paddingLeft: 30,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: GlobalColors.colors.pink500,
  },
  info: {
    paddingHorizontal: 50,
    fontSize: 15,
    color: "gray",
  },
});
