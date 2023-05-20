import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { GlobalColors } from "../constants/colors";
import { Button } from "react-native";
const API_URL = "http://localhost:3000";

function PaymentScreen({ navigation }) {
  const route = useRoute();

  const newPrice = route.params.price + "00";
  console.log(newPrice);

  const today = new Date();
  const formattedDate = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  // console.log(formattedDate);

  const stripe = useStripe();

  const subscribe = async () => {
    try {
      const response = await fetch("http://localhost:3000/pay", {
        method: "POST",
        body: JSON.stringify({ newPrice }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        appearance: {
          font: {
            family: "AvenirNext-Regular",
            scale: 1.15,
          },
          shapes: {
            borderRadius: 12,
            borderWidth: 0.5,
          },
          primaryButton: {
            shapes: {
              borderRadius: 10,
            },
            colors: {
              text: "#FFFFFF",
            },
          },
          colors: {
            // icon: GlobalColors.colors.darkDustyPurple,
            // primary: Colors.colors.darkDustyPurple,
            background: "#FFFFFF",
            // componentBackground: Colors.colors.cardBackgroundColor,
            // componentBorder: Colors.colors.gray,
            // componentDivider: Colors.colors.gray,
            // primaryText: Colors.colors.darkDustyPurple,
            // secondaryText: Colors.colors.dustyPurple,
            // componentText: Colors.colors.gray,
            // placeholderText: Colors.colors.gray,
          },
        },
        applePay: {
          merchantCountryCode: "US",
        },
      });
      if (initSheet.error) {
        return Alert.alert(initSheet.error.message);
        // showMessage({
        //   message: "The payment could not be initilized!",
        //   floating: true,
        //   // position: top,
        //   icon: "info",
        //   backgroundColor: Colors.colors.darkDustyPurple,
        //   color: "white",
        // });
        // return;
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) {
        // showMessage({
        //   message: "The payment could not go through!",
        //   floating: true,
        //   // position: top,
        //   icon: "info",
        //   backgroundColor: Colors.colors.darkDustyPurple,
        //   color: "white",
        // });
        // return;
        return Alert.alert(
          "The payment has been canceled!",
          "Please try again!",
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "default",
            },
          ]
        );
      }
      Alert.alert("Payment complete, thank you!");
      //   editFriend(userId, friendId, {
      //     receivedGift: 1,
      //     giftName: name,
      //     giftPrice: price,
      //     giftDate: formattedDate,
      //   });
      navigation.navigate("Bottom Navigator");
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  return (
    <StripeProvider
      publishableKey="pk_test_51N3nKMJ0sudgjiHdgS11OUwbHrjL1z3kFnkVrFcOu6qHVTOknIapZVj2F3R2A6VVkHSvQ4yTO9LvJfPJEU41qXxH00WjiWqv2r"
      merchantIdentifier="merchant.com.stripe.react.native"
    >
      <Button title="Press" onPress={subscribe} />
      <View style={styles.container}>
        <View style={styles.containerGift}></View>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={subscribe}
          >
            <Text style={styles.textButton}>Proceed to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-evenly",
  },
  containerGift: {
    justifyContent: "center",
    alignItems: "center",
  },
  textGift: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 20,
    // color: Colors.colors.darkDustyPurple,
    marginBottom: 20,
  },
  textName: {
    // fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    // color: Colors.colors.darkDustyPurple,
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    height: 400,
    width: 400,
    borderRadius: 10,
  },
  containerCard: {
    width: 280,
  },
  textCardDetails: {
    marginVertical: 5,
    textAlign: "left",
    // fontFamily: "Montserrat-Regular",
    fontSize: 16,
    // color: Colors.colors.darkDustyPurple,
  },
  card: {
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: Colors.colors.darkDustyPurple,
  },
  containerButton: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    // backgroundColor: Colors.colors.darkDustyPurple,
    width: 350,
    height: 60,
    borderRadius: 350 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: "white",
  },
});

export default PaymentScreen;
