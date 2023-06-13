import { createContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc } from "firebase/firestore";
export const AuthContext = createContext({
  token: "",
  name: "",
  uid: "",
  doctor: "",
  isDoctor: false,
  isAuthenticated: false,
  authenticate: () => {},
  userDetails: () => {},
  checkIsDoctor: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authName, setAuthName] = useState();
  const [authUid, setAuthUid] = useState();
  const [authDoctor, setAuthDoctor] = useState();
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setAuthToken(storedToken);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    async function fetchName() {
      const storedName = await AsyncStorage.getItem("name");
      if (storedName) {
        setAuthName(storedName);
      }
    }
    fetchName();
  }, []);
  useEffect(() => {
    async function fetchUid() {
      const storedUid = await AsyncStorage.getItem("uid");
      if (storedUid) {
        setAuthUid(storedUid);
      }
    }
    fetchUid();
  }, []);
  useEffect(() => {
    async function fetchIsDoctor() {
      const storedIsDoctor = await AsyncStorage.getItem("doctor");
      if (storedIsDoctor) {
        setAuthDoctor(storedIsDoctor);
      }
    }
    fetchIsDoctor();
  }, []);
  function authenticate(token) {
    setAuthToken(token);

    AsyncStorage.setItem("token", token);
  }
  function userDetails(name, id) {
    setAuthName(name);
    setAuthUid(id);
    AsyncStorage.setItem("name", name);
    AsyncStorage.setItem("uid", id);
  }
  function checkIsDoctor(doctor) {
    setAuthDoctor(doctor);
    AsyncStorage.setItem("doctor", doctor);
  }
  function logout() {
    setAuthToken(null);
    setAuthName(null);
    setAuthUid(null);
    setAuthDoctor(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("doctor");
  }
  const value = {
    token: authToken,
    name: authName,
    uid: authUid,
    doctor: authDoctor,
    isDoctor: !!authDoctor,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    userDetails: userDetails,
    checkIsDoctor: checkIsDoctor,
    logout: logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthContextProvider;
