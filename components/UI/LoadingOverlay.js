import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../constants/colors";

function LoadingOverlay({ message }) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator color={GlobalColors.colors.pink500} size="large" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "white",
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: GlobalColors.colors.pink500,
  },
});
