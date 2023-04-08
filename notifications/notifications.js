import * as Notifications from "expo-notifications";
import { parseISO, getTime } from "date-fns";
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});
export function scheduleNotificationHandler(doctorId, slot, date) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Upload consultation result!",
      body: "",
      data: {
        doctorId: doctorId,
        slot: slot,
        date: date,
      },
    },
    trigger: {
      seconds: 5,
    },
  });
  //   {
  //     console.log(getTime(parseISO(slot)));
  //   }
}
