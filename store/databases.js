import axios from "axios";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";

import { initializeApp } from "firebase/app";
import {
  doc,
  setDoc,
  getFirestore,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
  deleteObject,
} from "firebase/storage";
import uuid from "react-native-uuid";
import { getFormattedDate } from "../util/date";

const BACKEND_URL =
  "https://petapp-1a4cd-default-rtdb.europe-west1.firebasedatabase.app";
const API_KEY = "AIzaSyBym_mvIkISCb_yYVULgylYD2nXm-zpjoo";
const firebaseConfig = {
  apiKey: "AIzaSyBym_mvIkISCb_yYVULgylYD2nXm-zpjoo",
  authDomain: "petapp-1a4cd.firebaseapp.com",
  projectId: "petapp-1a4cd",
  storageBucket: "petapp-1a4cd.appspot.com",
  messagingSenderId: "291048897104",
  appId: "1:291048897104:web:78c3a0d031b455e0d02f55",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function createUser(name, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;
  addToFiresbase(name, email, response.data.localId);
  return token;
}
export async function editUser(
  telephone,
  description,
  fullname,
  gender,
  datebirth,
  uid
) {
  await setDoc(
    doc(db, "users", uid),
    {
      telephone: telephone,
      description: description,
      fullname: fullname,
      gender: gender,
      datebirth: datebirth,
    },
    { merge: true }
  );
}
export async function addToFiresbase(name, email, uid) {
  await setDoc(doc(db, "users", uid), {
    name: name,
    email: email,
    uid: uid,
  });
}

export async function addAnimal(name, breed, date, owner, color, gender, uid) {
  const aid = uuid.v4();
  const response = await axios.post(BACKEND_URL + "/animals.json", {
    nameA: name,
    breed: breed,
    date: date,
    owner: owner,
    color: color,
    gender: gender,
    aid: aid,
    uid: uid,
  });
  return { response: response, aid: aid };
}

export async function addAppointment(
  did,
  uid,
  aid,
  date,
  slot,
  appointmentReason,
  ownerName
) {
  const response = await axios.post(BACKEND_URL + `/appointments.json`, {
    aid: aid,
    uid: uid,
    did: did,
    date: date,
    slot: slot,
    reason: appointmentReason,
    ownername: ownerName,
    canceled: 0,
  });
  return response;
}
export async function getDoctorSlotsAppointments(did, date) {
  const slots = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);
  if (response.data) {
    const appointments = Object.values(response.data);

    const filtered = appointments.filter(function (appointment) {
      return appointment.did === did && appointment.date === date;
    });
    console.log(filtered);
    for (const key in filtered) {
      const slot = filtered[key].slot;

      slots.push(slot);
    }
    console.log(slots);
  }
  return slots;
}

export async function getAppointments(did, date) {
  const appointmentsDetails = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);
  const appointments = Object.values(response.data);
  //console.log(appointments);
  const filtered = appointments.filter(function (appointment) {
    return appointment.did === did && appointment.date === date;
  });
  //console.log(filtered);
  for (const key in filtered) {
    const appointmentDetail = {
      did: filtered[key].did,
      date: filtered[key].date,
      uid: filtered[key].uid,
      slot: filtered[key].slot,
      animal: await getAnimalDetails(filtered[key].aid),
      reason: filtered[key].reason,
      ownername: filtered[key].ownername,
      photoUrl: await getImageUrl(
        `${filtered[key].uid}/${filtered[key].aid}.jpeg`
      ),
      generatedId: key,
    };
    appointmentsDetails.push(appointmentDetail);
  }
  // console.log(appointmentsDetails);
  return appointmentsDetails;
}

export async function getUserStatusAppointments(uid, status) {
  const appointmentsDetails = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);
  if (response.data) {
    const appointments = Object.values(response.data);
    // console.log(appointments);
    let filtered;
    if (status === 0) {
      filtered = appointments.filter(function (appointment) {
        return (
          (appointment.uid === uid &&
            appointment.date > getFormattedDate(new Date())) ||
          (appointment.date === getFormattedDate(new Date()) &&
            appointment.slot.slice(6, 11) >=
              `${new Date().getHours()}:${new Date().getMinutes()}`)
        );
      });
    } else if (status === 1) {
      filtered = appointments.filter(function (appointment) {
        return (
          (appointment.uid === uid &&
            appointment.date < getFormattedDate(new Date())) ||
          (appointment.date === getFormattedDate(new Date()) &&
            appointment.slot.slice(6, 11) <
              `${new Date().getHours()}:${new Date().getMinutes()}`)
        );
      });
    } else {
      filtered = appointments.filter(function (appointment) {
        return appointment.uid === uid && appointment.canceled === 1;
      });
    }

    for (const key in filtered) {
      const appointmentDetail = {
        did: filtered[key].did,
        date: filtered[key].date,
        uid: filtered[key].uid,
        slot: filtered[key].slot,
        animal: await getAnimalDetails(filtered[key].aid),
        reason: filtered[key].reason,
        canceled: filtered[key].canceled,
        ownername: filtered[key].ownername,
        photoUrl: await getImageUrl(
          `${filtered[key].uid}/${filtered[key].aid}.jpeg`
        ),
        generatedId: key,
      };
      appointmentsDetails.push(appointmentDetail);
    }
  }

  return appointmentsDetails;
}

export async function editAnimal(generatedId, data) {
  const response = await axios.put(
    BACKEND_URL + `/animals/${generatedId}.json`,
    data
  );
  console.log(response);
  return response;
}
export async function getAnimalDetails(aid) {
  const response = await axios.get(BACKEND_URL + `/animals.json`);
  const animals = Object.values(response.data);
  const filtered = animals.filter(function (animal) {
    return animal.aid === aid;
  });
  const filteredObj = Object.assign({}, filtered[0]);
  return filteredObj;
}
export async function getUsersAnimals(uid) {
  const animals = [];

  const response = await axios.get(BACKEND_URL + `/animals.json`);
  for (const key in response.data) {
    if (response.data[key].uid === uid) {
      const animalObj = {
        aid: response.data[key].aid,
        name: response.data[key].nameA,
        breed: response.data[key].breed,
        owner: response.data[key].owner,
        gender: response.data[key].gender,
        color: response.data[key].color,
        date: response.data[key].date,
        photoUrl: await getImageUrl(`${uid}/${response.data[key].aid}.jpeg`),
        generatedId: key,
      };

      animals.push(animalObj);
    }
  }
  return animals;
}
export async function login(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  const token = response.data.idToken;
  const id = response.data.localId;
  const name = await getUserName(id);
  const loginresult = { token: token, id: id, name: name };
  return loginresult;
}
export async function getUserName(id) {
  const docRef = doc(db, "users", id);
  try {
    const userData = await getDoc(docRef);
    if (docRef) {
      const obj = userData.data();
      return obj.name;
    } else {
      console.log("Document does not exist");
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getDoctorsList() {
  const docRef = collection(db, "users");
  const doctors = [];
  const emailRegex = /@doctor\.petapp\.ro$/;
  try {
    const userData = await getDocs(docRef);
    if (userData.docs.length > 0) {
      const docs = userData.docs;
      for (let i = 0; i < docs.length; i++) {
        const data = docs[i].data();
        if (emailRegex.test(data.email)) {
          const doctor = {
            name: data.name,
            fullname: data.fullname,
            telephone: data.telephone,
            email: data.email,
            datebirth: data.datebirth,
            gender: data.gender,
            did: data.uid,
            description: data.description,
            photo: await getImageUrl(`doctor/${data.uid}`),
          };

          doctors.push(doctor);
        }
      }
    } else {
      console.log("Document does not exist");
    }
  } catch (error) {
    console.log(error);
  }
  return doctors;
}
export async function getDoctorDetails(id) {
  const docRef = doc(db, "users", id);
  try {
    const userData = await getDoc(docRef);
    if (docRef) {
      const obj = userData.data();
      if (
        obj.fullname &&
        obj.telephone &&
        obj.gender &&
        obj.description &&
        obj.datebirth
      ) {
        return {
          fullname: obj.fullname,
          telephone: obj.telephone,
          gender: obj.gender,
          description: obj.description,
          datebirth: obj.datebirth,
          did: obj.uid,
          photo: await getImageUrl(`doctor/${id}`),
        };
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function storeImage(path, formattedPath) {
  const imageRef = ref(storage, formattedPath);
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", path, true);
    xhr.send(null);
  });
  const snap = await uploadBytes(imageRef, blob);
  blob.close();
  return snap;
}

export async function editImage(path, newPath) {
  const imageRef = ref(storage, path);
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", newPath, true);
    xhr.send(null);
  });
  const snap = await uploadBytes(imageRef, blob);
  console.log(snap);
  blob.close();
  return snap;
}

export async function getImageUrl(path) {
  const imageRef = ref(storage, path);
  const url = await getDownloadURL(imageRef).then((responseUrl) => {
    return responseUrl;
  });

  return url;
}
