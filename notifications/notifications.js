import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true,
    attachments: [{ url: "https://example.com/image.png" }],
    badgeIconType: "alert",
  }),
});

export const getPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    return;
  }
};
export function scheduleNotificationHandler(title, body, name) {
  getPermissions();
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: {},
    },
    trigger: {
      seconds: 20,
    },
  });
}

export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export function sendPushNotificationHandler(token, title, body) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
      data: {
        "content-available": 1,
        // contentAvailable: true,
      },
    }),
    content: {
      shouldShowAlert: true,
      attachments: [
        {
          url: "https://example.co.https://www.google.https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fflowers%2F&psig=AOvVaw101J5qfniVDI2ako3bUe9x&ust=1682288172248000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLiZ5vnBvv4CFQAAAAAdAAAAABAJcom/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fflowers.html&psig=AOvVaw101J5qfniVDI2ako3bUe9x&ust=1682288172248000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLiZ5vnBvv4CFQAAAAAdAAAAABAEpng",
        },
      ],
      badgeIconType: "alert",
    },
  });
}
