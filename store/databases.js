import axios from "axios";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { registerForPushNotificationsAsync } from "../notifications/notifications";
import { initializeApp, firebase } from "firebase/app";
import {
  doc,
  setDoc,
  updateDoc,
  getFirestore,
  initializeFirestore,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
  limit,
  get,
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
// const db = getFirestore(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
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

export async function addMessage(chatid, usermsg) {
  const chatRef = doc(db, "Chats", chatid);
  await setDoc(chatRef, {}, { merge: true });
  const conversationRef = doc(collection(chatRef, "messages"));
  await setDoc(conversationRef, {
    ...usermsg,
  });
}
export function getMessagesFunction(chatid) {
  const msgRef = collection(db, "Chats", chatid, "messages");
  const q = query(msgRef, orderBy("createdAt", "desc"));
  let msg = [];
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let msg = [];
        querySnapshot.docs.map((docSanp) => {
          msg.push({
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          });
        });

        resolve(msg);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
}
export async function getMessagesWithUsers(userId) {
  console.log(userId, "user");
  const chatsRef = collection(db, "Chats");
  const querySnapshot = await getDocs(chatsRef);
  const conversations = [];
  querySnapshot.forEach((doc) => {
    const chatId = doc.id;
    console.log(doc, "doc");
    if (chatId.includes(userId)) {
      const otherUserId = chatId.replace(userId, "").replace("-", "");

      conversations.push({ chatId, otherUserId });
    }
  });
  console.log(conversations, "conv");

  return conversations;
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
export async function addToFiresbaseChatConversation(prop) {
  console.log(prop);
  const conversationRef = doc(collection(db, "chats"));
  await setDoc(conversationRef, {
    ...prop,
  });
}
export async function getConversationsByDoctor(
  setMessages,
  senderId,
  receiverId
) {
  const conversationsRef = collection(db, "chats");
  const q = query(conversationsRef, orderBy("createdAt", "desc"), limit(50));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log(snapshot);
    setMessages(
      snapshot.docs
        .filter((doc) => {
          return (
            (doc.data().senderId === senderId &&
              doc.data().receiverId === receiverId) ||
            (doc.data().senderId === receiverId &&
              doc.data().receiverId === senderId)
          );
        })
        .map((doc) => ({
          key: doc.id,
          _id: doc.id,
          ...doc.data(),
        }))
    );
  });
  return () => unsubscribe();
}

export async function getUsersWithConversations(userId) {
  const conversationsRef = collection(db, "chats");
  const q = query(conversationsRef, orderBy("createdAt", "desc"), limit(50));

  const snapshot = await getDocs(q);

  const conversations = snapshot.docs
    .filter((doc) => {
      return doc.data().senderId === userId || doc.data().receiverId === userId;
    })
    .map((doc) => ({
      id:
        doc.data().senderId === userId
          ? doc.data().receiverId
          : doc.data().senderId,
      _id: doc.id,
      ...doc.data(),
    }));
  console.log(conversations, "conv");
  const uniqueUsers = conversations.reduce((acc, conversation) => {
    if (!acc.some((user) => user.id === conversation.id)) {
      acc.push(conversation);
    }
    return acc;
  }, []);
  console.log(uniqueUsers, "unique");

  return uniqueUsers;
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

// export async function addToken(uid) {
//   const expoToken = await registerForPushNotificationsAsync();
//   const resp = await axios.put(BACKEND_URL + `/tokens/${uid}.json`, {
//     uid: uid,
//     tokenExpo: expoToken,
//   });
// }

// export async function getTokens() {
//   const tokens = [];
//   const response = await axios.get(BACKEND_URL + `/tokens.json`);
//   for (const key in response.data) {
//     const TokenObj = {
//       uid: response.data[key].uid,
//       token: response.data[key].tokenExpo,
//     };
//     tokens.push(TokenObj);
//   }
//   return tokens;
// }

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

export async function addNotification(uid, aid, momentTime, pill, date, name) {
  const response = await axios.post(BACKEND_URL + `/notifications.json`, {
    aid: aid,
    uid: uid,
    momentTime: momentTime,
    date: date,
    pill: pill,
    name: name,
  });
  return response;
}
export async function addNotificationAppointment(
  uid,
  aid,
  date,
  name,
  active,
  slot
) {
  const response = await axios.post(
    BACKEND_URL + `/notificationsAppointment.json`,
    {
      aid: aid,
      uid: uid,
      date: date,
      name: name,
      active: active,
      slot: slot,
    }
  );
  return response;
}

export async function deleteNotificationAppointment(generatedId) {
  const response = await axios.delete(
    BACKEND_URL + `/notificationsAppointment/${generatedId}.json`
  );
  return response;
}

export async function deleteNotification(generatedId) {
  const response = await axios.delete(
    BACKEND_URL + `/notifications/${generatedId}.json`
  );
  return response;
}
export async function getNotifications(uid, aid) {
  const response = await axios.get(BACKEND_URL + `/notifications.json`);
  let notificationsDetails = [];
  if (response.data) {
    const notificationsKeys = Object.keys(response.data);
    const notifications = Object.values(response.data);
    notifications.map((notification, index) => {
      notification.key = notificationsKeys[index];
    });

    const filtered = notifications.filter(function (notification) {
      return notification.aid === aid && notification.uid === uid;
    });
    for (const key in filtered) {
      const notificationDetail = {
        aid: filtered[key].aid,
        date: filtered[key].date,
        uid: filtered[key].uid,
        pill: filtered[key].pill,
        momentTime: filtered[key].momentTime,
        generatedId: filtered[key].key,
        name: filtered[key].name,
      };
      notificationsDetails.push(notificationDetail);
    }
  }

  return notificationsDetails;
}
export async function getNotificationsAppointment(uid, aid) {
  const response = await axios.get(
    BACKEND_URL + `/notificationsAppointment.json`
  );
  let notificationsDetails = [];
  if (response.data) {
    const notificationsKeys = Object.keys(response.data);
    const notifications = Object.values(response.data);
    notifications.map((notification, index) => {
      notification.key = notificationsKeys[index];
    });

    const filtered = notifications.filter(function (notification) {
      return notification.aid === aid && notification.uid === uid;
    });
    for (const key in filtered) {
      const notificationDetail = {
        aid: filtered[key].aid,
        date: filtered[key].date,
        uid: filtered[key].uid,
        active: filtered[key].active,
        generatedId: filtered[key].key,
        name: filtered[key].name,
      };
      notificationsDetails.push(notificationDetail);
    }
  }
  return notificationsDetails;
}
export async function getUserNotifications(uid) {
  const response = await axios.get(BACKEND_URL + `/notifications.json`);
  let notificationsDetails = [];
  if (response.data) {
    const notificationsKeys = Object.keys(response.data);
    const notifications = Object.values(response.data);
    notifications.map((notification, index) => {
      notification.key = notificationsKeys[index];
    });
    const filtered = notifications.filter(function (notification) {
      return notification.uid === uid;
    });
    for (const key in filtered) {
      const notificationDetail = {
        aid: filtered[key].aid,
        date: filtered[key].date,
        uid: filtered[key].uid,
        pill: filtered[key].pill,
        momentTime: filtered[key].momentTime,
        generatedId: filtered[key].key,
        name: filtered[key].name,
      };
      notificationsDetails.push(notificationDetail);
    }
  }
  return notificationsDetails;
}

export async function getUserAppointmentsNotifications(uid) {
  const response = await axios.get(
    BACKEND_URL + `/notificationsAppointment.json`
  );
  let notificationsDetails = [];
  // console.log(response);
  if (response.data) {
    const notificationsKeys = Object.keys(response.data);
    const notifications = Object.values(response.data);
    notifications.map((notification, index) => {
      notification.key = notificationsKeys[index];
    });
    const filtered = notifications.filter(function (notification) {
      return notification.uid === uid;
    });
    console.log(filtered);
    for (const key in filtered) {
      const notificationDetail = {
        aid: filtered[key].aid,
        date: filtered[key].date,
        uid: filtered[key].uid,
        name: filtered[key].name,
        generatedId: filtered[key].key,
        active: filtered[key].active,
      };
      notificationsDetails.push(notificationDetail);
    }
  }
  return notificationsDetails;
}

export async function cancelAppointment(appointmentId, data) {
  const response = await axios.put(
    BACKEND_URL + `/appointments/${appointmentId}.json`,
    data
  );
  console.log(appointmentId);
  return response;
}
export async function getDoctorSlotsAppointments(did, date) {
  const slots = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);
  if (response.data) {
    const appointments = Object.values(response.data);
    console.log(appointments);
    const filtered = appointments.filter(function (appointment) {
      return (
        appointment.did === did &&
        appointment.date === date &&
        appointment.canceled === 0
      );
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
  const appointmentKeys = Object.keys(response.data);
  const appointments = Object.values(response.data);
  appointments.map((appointment, index) => {
    appointment.key = appointmentKeys[index];
  });
  // console.log(appointments);
  const filtered = appointments.filter(function (appointment) {
    return (
      appointment.did === did &&
      appointment.date === date &&
      appointment.canceled === 0
    );
  });
  console.log(did, date);
  console.log(filtered);

  // console.log(filtered);
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
      generatedId: filtered[key].key,
    };
    {
      filtered[key].hasOwnProperty("done")
        ? (appointmentDetail["done"] = 1)
        : null;
    }
    console.log(appointmentDetail);
    appointmentsDetails.push(appointmentDetail);
  }
  // console.log(appointmentsDetails);
  appointmentsDetails.sort((ap1, ap2) => ap1.slot.localeCompare(ap2.slot));
  return appointmentsDetails;
}

export async function getUserStatusAppointments(uid, status) {
  let appointmentsDetails = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);

  if (response.data) {
    const appointmentKeys = Object.keys(response.data);
    const appointments = Object.values(response.data);
    appointments.map((appointment, index) => {
      appointment.key = appointmentKeys[index];
    });

    let filtered;
    console.log(status + "status");
    const currentDate = new Date();
    const timezoneOffset = 180;
    const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
    const romaniaDateTime = new Date(romanianTime);
    if (status === 0) {
      filtered = appointments.filter(function (appointment) {
        return (
          appointment.uid === uid &&
          appointment.canceled === 0 &&
          (appointment.date > getFormattedDate(romaniaDateTime) ||
            (appointment.date === getFormattedDate(romaniaDateTime) &&
              appointment.slot.slice(6, 11) >=
                romaniaDateTime.toISOString().slice(11, 16)))
        );
      });
      console.log(romaniaDateTime.toISOString().slice(11, 16));

      console.log(romaniaDateTime);
    } else if (status === 1) {
      filtered = appointments.filter(function (appointment) {
        return (
          (appointment.uid === uid &&
            appointment.canceled === 0 &&
            appointment.date < getFormattedDate(new Date(romaniaDateTime))) ||
          (appointment.date === getFormattedDate(new Date(romaniaDateTime)) &&
            appointment.slot.slice(6, 11) <
              romaniaDateTime.toISOString().slice(11, 16))
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
        generatedId: filtered[key].key,
      };

      appointmentsDetails.push(appointmentDetail);
    }
  }

  appointmentsDetails = appointmentsDetails.sort((ap1, ap2) => {
    if (ap1.date < ap2.date) return -1;
    if (ap1.date > ap2.date) return 1;
    if (ap1.slot < ap2.slot) return -1;
    if (ap1.slot > ap2.slot) return 1;
    return 0;
  });

  return appointmentsDetails;
}

export async function getAnimalDoneAppointments(uid, aid) {
  let appointmentsDetails = [];
  const response = await axios.get(BACKEND_URL + `/appointments.json`);

  if (response.data) {
    const appointmentKeys = Object.keys(response.data);
    const appointments = Object.values(response.data);
    appointments.map((appointment, index) => {
      appointment.key = appointmentKeys[index];
    });

    let filtered = [];

    filtered = appointments.filter(function (appointment) {
      return (
        appointment.uid === uid &&
        appointment.hasOwnProperty("done") &&
        appointment.aid === aid
      );
    });

    for (const key in filtered) {
      const appointmentDetail = {
        did: filtered[key].did,
        date: filtered[key].date,
        uid: filtered[key].uid,
        slot: filtered[key].slot,
        aid: filtered[key].aid,
        reason: filtered[key].reason,
        canceled: filtered[key].canceled,
        ownername: filtered[key].ownername,
        generatedId: filtered[key].key,
        done: filtered[key].done,
        result: filtered[key].result,
      };

      appointmentsDetails.push(appointmentDetail);
    }
  }

  appointmentsDetails = appointmentsDetails.sort((ap1, ap2) => {
    if (ap1.date < ap2.date) return -1;
    if (ap1.date > ap2.date) return 1;
    if (ap1.slot < ap2.slot) return -1;
    if (ap1.slot > ap2.slot) return 1;
    return 0;
  });

  return appointmentsDetails;
}
export function calculateAnimalPillDays(doneAppointments) {
  let resp = [];
  resp = doneAppointments;
  const pillDays = [];
  if (resp) {
    let consultations = [];
    consultations = resp.filter(
      (item) => item.result.doctorReason.localeCompare("Consultation") === 0
    );
    const currentDate = new Date();
    const timezoneOffset = 180;
    const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
    const romaniaDateTime = new Date(romanianTime);
    for (const key in consultations) {
      const appointmentDate = new Date(consultations[key].date);
      const diffInTime = romaniaDateTime.getTime() - appointmentDate.getTime();
      const daysSinceAppointment = Math.floor(
        diffInTime / (1000 * 60 * 60 * 24)
      );
      // console.log(daysSinceAppointment + "dif");
      for (const keyn in consultations[key].result.pillsPlan) {
        const pill = consultations[key].result.pillsPlan[keyn];
        if (pill.pillTimes > daysSinceAppointment) {
          let myDate = new Date(consultations[key].date);
          myDate.setDate(myDate.getUTCDate() + pill.pillTimes - 1);
          myDate = getFormattedDate(myDate);
          pillDays.push({
            pillName: pill.pillName,
            pillCount: pill.pillCount,
            pillMomentDay: pill.pillMomentDay,
            pillTimes: pill.pillTimes,
            additionalInfo: pill.additionalInfo,
            pillFirstDay: consultations[key].date,
            pillLastDay: myDate,
          });
        }
      }
    }
  }
  return pillDays;
}
export async function editAnimal(generatedId, data) {
  const response = await axios.put(
    BACKEND_URL + `/animals/${generatedId}.json`,
    data
  );
  console.log(response);
  return response;
}
export async function editAppointment(appointmentId, data) {
  const response = await axios.put(
    BACKEND_URL + `/appointments/${appointmentId}.json`,
    data
  );
  console.log(appointmentId);
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
export async function getUserDetails(id) {
  const docRef = doc(db, "users", id);
  try {
    const userData = await getDoc(docRef);
    if (docRef) {
      const obj = userData.data();
      return {
        name: obj.name,
        email: obj.email,
      };
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
