import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { useState } from "react";
import { Dimensions } from "react-native";
function HeaderButtonAppointment({ status, count, pressed, textSize }) {
  return (
    <View
      style={[
        styles.headerButton,
        pressed != null && {
          borderBottomColor: GlobalColors.colors.pink500,
          borderWidth: 1.5,
        },
      ]}
    >
      <Text style={[styles.status, textSize ? { fontSize: textSize } : 17]}>
        {status}
      </Text>
      <View
        style={[
          styles.count,
          textSize && { height: 20, width: 20, borderRadius: 10 },
        ]}
      >
        <Text style={[styles.countText, textSize && { fontSize: 10 }]}>
          {count}
        </Text>
      </View>
    </View>
  );
}
export default HeaderButtonAppointment;
const styles = StyleSheet.create({
  headerButton: {
    borderColor: "transparent",
    borderBottomColor: GlobalColors.colors.gray10,
    borderWidth: 0.8,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "center",
    width: Dimensions.get("window").width / 3,
  },
  count: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: GlobalColors.colors.pink500,
    borderColor: GlobalColors.colors.pink500,
    marginLeft: 5,
    paddingHorizontal: 2,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  status: {
    fontFamily: "Garet-Book",
    fontSize: 17,
    color: GlobalColors.colors.pink100,
    marginRight: 10,
  },
  countText: {
    fontFamily: "Garet-Book",
    color: "white",
    fontSize: 14,
  },
});
