import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { GlobalColors } from "../../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

function PillCardPlan({ pillName, pillTimes, handlerDelete, index, moment }) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcon
            name={"pill"}
            size={40}
            color={GlobalColors.colors.pink500}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: -25,
            marginHorizontal: 30,
          }}
        >
          <Text style={styles.pillName}>{pillName}</Text>
          <Text style={styles.pillTimes}>
            {moment ? `${pillTimes} days` : pillTimes}
          </Text>
        </View>
        <View style={{ position: "absolute", marginLeft: 335, top: -5 }}>
          <TouchableOpacity
            onPress={() => {
              handlerDelete(index, moment);
            }}
          >
            <MaterialCommunityIcon
              name="close-circle"
              color={GlobalColors.colors.gray10}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default PillCardPlan;
const styles = StyleSheet.create({
  container: {
    height: 80,
    width: 375,
    backgroundColor: GlobalColors.colors.gray0,
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "center",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  iconContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: GlobalColors.colors.gray10,
    alignItems: "center",
    justifyContent: "center",
  },
  pillName: {
    fontSize: 20,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.darkGrey,
  },
  pillTimes: {
    fontSize: 15,
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.gray10,
    position: "absolute",
    top: 55,
    left: 2,
  },
});
