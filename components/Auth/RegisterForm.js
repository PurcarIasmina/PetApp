import {
  View,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import Input from "./Input";
import { useRef, useEffect, useState } from "react";
import ButtonCustom from "../UI/ButtonCustom";
import { useNavigation } from "@react-navigation/native";
import { GlobalColors } from "../../constants/colors";

function emailValidation(value) {
  const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return reg.test(value);
}
function RegisterForm({ onAuthenticate }) {
  function updateError(error, stateUpdater) {
    stateUpdater(error);
    setTimeout(() => {
      setEmailInvalid(false);
      setNameInvalid(false);
      setPasswordInvalid(false);
      setConfPasswordInvalid(false);
      stateUpdater("");
    }, 5000);
  }
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfPassword, setConfUserPassword] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [confPasswordInvalid, setConfPasswordInvalid] = useState(false);
  const navigation = useNavigation();
  function handlerOnChangeName(value) {
    setUserName(value);
  }
  function handlerOnChangeEmail(value) {
    setUserEmail(value);
  }
  function handlerOnChangePassword(value) {
    setUserPassword(value);
  }
  function handlerOnChangeConfPassword(value) {
    setConfUserPassword(value);
  }
  function handlerValidation() {
    if (
      !userName.trim() ||
      !userEmail.trim() ||
      !userPassword.trim() ||
      !userConfPassword.trim()
    ) {
      setNameInvalid(true);
      setEmailInvalid(true);
      setPasswordInvalid(true);
      setConfPasswordInvalid(true);
      return updateError("All fields are required!", setError);
    }
    if (!userName.trim() || userName.length < 5) {
      setNameInvalid(true);
      return updateError("Invalid name, minimum 5 characters!", setError);
    }
    if (!emailValidation(userEmail)) {
      setEmailInvalid(true);
      return updateError("Invalid email!", setError);
    }
    if (!userPassword.trim() || userPassword.length < 8) {
      setPasswordInvalid(true);
      return updateError("Password must have at least 8 characters!", setError);
    }
    if (userPassword !== userConfPassword) {
      setConfPasswordInvalid(true);
      return updateError("Passwords must match!", setError);
    }

    return true;
  }

  function submitForm() {
    if (handlerValidation()) {
      onAuthenticate({
        name: userName,
        email: userEmail,
        password: userPassword,
      });
      navigation.replace("LogIn");
    }
  }
  return (
    <KeyboardAvoidingView style={styles.form} behavior="=" padding>
      <Input
        isInvalid={nameInvalid}
        value={userName}
        onChangeText={handlerOnChangeName}
        icon="person"
        placeholder="Name"
        keyboardType="default"
      />
      <Input
        isInvalid={emailInvalid}
        value={userEmail}
        onChangeText={handlerOnChangeEmail}
        icon="mail"
        placeholder="Email"
        keyboardType="email-address"
      />
      <Input
        isInvalid={passwordInvalid}
        value={userPassword}
        onChangeText={handlerOnChangePassword}
        icon="key"
        secure={true}
        placeholder="Password"
        keyboardType="default"
      />
      <Input
        isInvalid={confPasswordInvalid}
        value={userConfPassword}
        onChangeText={handlerOnChangeConfPassword}
        icon="key"
        secure={true}
        placeholder="Confirm Password"
        keyboardType="default"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <ButtonCustom onPress={submitForm} color={GlobalColors.colors.pink10}>
          Register in
        </ButtonCustom>
      </View>
    </KeyboardAvoidingView>
  );
}
export default RegisterForm;
const styles = StyleSheet.create({
  form: {
    margin: 2,
    marginTop: 1,
    padding: 30,
    paddingBottom: 5,
  },
  buttonContainer: {
    paddingHorizontal: 80,
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
  },
});
