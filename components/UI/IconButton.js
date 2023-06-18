import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/colors";
import { useFonts } from "expo-font";
import { Tooltip } from "react-native-paper";
import { useState } from "react";
function IconButton({
  icon,
  size,
  color,
  label,
  onPress,
  top,
  text,
  left,
  tip,
  tipText,
}) {
  const [fonts] = useFonts({
    Lora: require("../../constants/fonts/Lora-VariableFont_wght.ttf"),
    "Garet-Book": require("../../constants/fonts/Garet-Book.ttf"),
  });
  const leftValue = left - 20;
  const [tipR, setTip] = useState(false);
  return (
    <View style={[styles.iconContainer]}>
      <View style={{ top: top, marginLeft: left }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={() => setTip(true)}
          onPressOut={() => setTip(false)}
        >
          <Ionicons style={styles.icon} name={icon} size={size} color={color} />
        </TouchableOpacity>
        {tip && tipR && (
          <View
            style={{
              backgroundColor: GlobalColors.colors.pink500,
              marginTop: 70,
              height: 22,
              width: 140,
              paddingHorizontal: 5,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: [{ translateX: -62 }, { translateY: -25 }],
            }}
          >
            <Text
              style={{
                fontFamily: "Garet-Book",
                color: GlobalColors.colors.gray0,
              }}
            >
              {tipText}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, { paddingTop: top }]}>{label}</Text>
    </View>
  );
}
export default IconButton;
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    paddingBottom: 10,
  },
  label: {
    fontFamily: "Garet-Book",
    fontWeight: "bold",
    color: GlobalColors.colors.darkGrey,
    paddingTop: 2,
    paddingRight: 2,
    paddingLeft: 4,
    marginHorizontal: 2,
  },
});
