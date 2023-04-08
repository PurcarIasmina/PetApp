import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import Input from "./Input";
import ButtonCustom from "../UI/ButtonCustom";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { GlobalColors } from "../../constants/colors";
function emailValidation(value) {
  const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return reg.test(value);
}

function LoginForm({ onLogin }) {
  function updateError(error, stateUpdater) {
    stateUpdater(error);
    setTimeout(() => {
      setEmailInvalid(false);
      setPasswordInvalid(false);
      stateUpdater("");
    }, 5000);
  }
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const navigation = useNavigation();

  function handlerOnChangeEmail(value) {
    setUserEmail(value);
  }
  function handlerOnChangePassword(value) {
    setUserPassword(value);
  }

  function handlerValidation() {
    if (!userEmail.trim() || !userPassword.trim()) {
      setEmailInvalid(true);
      setPasswordInvalid(true);
      return updateError("All fields are required!", setError);
    }

    if (!emailValidation(userEmail)) {
      setEmailInvalid(true);
      return updateError("Invalid email!", setError);
    }
    if (!userPassword.trim() || userPassword.length < 8) {
      setPasswordInvalid(true);
      return updateError("Password must have at least 8 characters!", setError);
    }

    return true;
  }

  function submitForm() {
    if (handlerValidation()) {
      onLogin({ email: userEmail, password: userPassword });
    }
  }
  return (
    <View style={styles.form} behavior="padding">
      <Input
        isInvalid={emailInvalid}
        onChangeText={handlerOnChangeEmail}
        defaultValue={userEmail}
        icon="mail"
        placeholder="Email"
        keyboardType="email-address"
      />
      <Input
        isInvalid={passwordInvalid}
        onChangeText={handlerOnChangePassword}
        defaultValue={userPassword}
        icon="key"
        secure={true}
        placeholder="Password"
        keyboardType="default"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <ButtonCustom color={GlobalColors.colors.pink10} onPress={submitForm}>
          Login
        </ButtonCustom>
      </View>
    </View>
  );
}
export default LoginForm;
const styles = StyleSheet.create({
  form: {
    margin: 4,
    marginTop: 1,
    paddingHorizontal: 40,
    paddingVertical: 30,
    paddingBottom: 2,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
  },
});
