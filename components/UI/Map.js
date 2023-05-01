import { useCallback, useLayoutEffect, useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { GlobalColors } from "../../constants/colors";

function Map() {
  const route = useRoute();
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showText, setShowText] = useState(true);

  const [petLocation] = useState({
    accuracy: 4.774709928059785,
    altitude: 90.41566489636898,
    altitudeAccuracy: 3.32064483732846,
    heading: -1,
    latitude: 45.70800204449565,
    longitude: 21.237041893532144,
    speed: 0,
  });
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      console.log(location);
      console.log(coords);
    })();
  }, []);

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: petLocation?.latitude || 37.78,
        longitude: petLocation?.longitude || -122.43,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      //   onPress={(event) => setLocation(event.nativeEvent.coordinate)}
      showsUserLocation={true}
      showsTraffic={true}
      zoomEnabled={true}
      mapType="terrian"
      maxZoomLevel={600}
    >
      {petLocation && (
        <Marker
          title="Pet Hotel"
          coordinate={{
            latitude: petLocation.latitude,
            longitude: petLocation.longitude,
          }}
          onDeselect={() => setShowText(!showText)}
        >
          {showText && (
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>Pet Hotel</Text>

                  <Image
                    style={styles.image}
                    source={require("../../images/logoo.png")}
                  />
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          )}
        </Marker>
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    width: "90%",
    alignSelf: "center",
    height: "30%",
    marginBottom: 10,
    shadowColor: "#333333",
    shadowOffset: { width: -2, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
  },

  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,

    width: 160,
    height: 80,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,

    textAlign: "center",
    top: 10,
    color: GlobalColors.colors.blue500,
  },
  // Character image
  image: {
    width: "100%",
    height: 80,
  },
});
