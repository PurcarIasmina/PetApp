import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, StyleSheet, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../../constants/colors";
import { AuthContext } from "../../context/auth";
import { useContext } from "react";
function CustomDrawer(props) {
  const authCtx = useContext(AuthContext);
  let name;
  if (authCtx.isDoctor === false) name = `Hello, ${authCtx.name}`;
  else name = `Hello, Doctor ${authCtx.name}`;
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: GlobalColors.colors.pink1 }}
      >
        <Image
          source={require("../../images/logoo.png")}
          style={styles.image}
        />
        <Text
          style={{
            paddingLeft: 10,
            fontSize: 15,
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
          }}
        >
          {name}
        </Text>
        <View style={{ backgroundColor: "white", flex: 1, paddingTop: 20 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          onPress={authCtx.logout}
          style={{ paddingVertical: 20 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="exit-outline"
              size={20}
              color={GlobalColors.colors.pink500}
            />
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 15,
                fontFamily: "Garet-Book",
                color: GlobalColors.colors.pink500,
              }}
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default CustomDrawer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    padding: 20,
    height: 120,
  },
  image: {
    height: 80,
    width: 230,
    alignSelf: "center",
    marginBottom: 20,
  },
});
