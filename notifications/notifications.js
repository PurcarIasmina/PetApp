import * as Notifications from "expo-notifications";

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
export async function scheduleNotificationHandler(title, body, date) {
  getPermissions();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
      date: date,
    },
  });
  return id;
}
export async function cancelNotification(notificationId) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
