import { Switch } from "react-native-paper";
import { useState, useContext, useEffect, useLayoutEffect } from "react";
import { GlobalColors } from "../../constants/colors";
import {
  cancelNotification,
  scheduleNotificationHandler,
  sendPushNotificationHandler,
} from "../../notifications/notifications";
import { AuthContext } from "../../context/auth";
import { getTime } from "date-fns";
import {
  addNotification,
  deleteNotification,
  addNotificationAppointment,
  deleteNotificationAppointment,
} from "../../store/databases";
import moment from "moment";
import { getFormattedDate } from "../../util/date";
function Switcher({
  aid,
  name,
  momentTime,
  pill,
  date,
  status,
  notificationChanged,
  notificationValue,
  notificationId,
  generatedId,
  setSelctedDateReceived,
  appointmentReminder,
  slot,
  active,
}) {
  console.log(slot, active);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  console.log(isSwitchOn);
  const authCtx = useContext(AuthContext);
  console.log(generatedId);
  useLayoutEffect(() => {
    setIsSwitchOn(status);
  }, [status]);
  const timezoneOffset = 180;
  const romanianTime = new Date().getTime() + timezoneOffset * 60 * 1000;
  const actualDateMoment = moment(
    getFormattedDate(new Date(romanianTime)),
    "YYYY-MM-DD"
  );
  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    if (appointmentReminder === null) {
      if (!isSwitchOn) {
        try {
          let notificationId = "";
          if (momentTime === "Evening") {
            notificationId = await scheduleNotificationHandler(
              "Reminder!🌛",
              `Administrate to ${name} evening medication`,
              new Date(`${getFormattedDate(new Date(date))} 20:00:00`)
            );
          } else if (momentTime === "Morning") {
            notificationId = await scheduleNotificationHandler(
              "Reminder! ☕️",
              `Administrate to ${name} morning medication`,
              new Date(`${getFormattedDate(new Date(date))} 08:00:00`)
            );
          } else {
            notificationId = await scheduleNotificationHandler(
              "Reminder!🍴",
              `Administrate to ${name} lunch medication`,
              new Date(`${getFormattedDate(new Date(date))} 13:00:00`)
            );
          }
          const resp = await addNotification(
            authCtx.uid,
            aid,
            momentTime,
            pill,
            date,
            name,
            notificationId
          );

          notificationChanged(!notificationValue);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          if (generatedId) {
            await cancelNotification(notificationId);
            const resp = await deleteNotification(generatedId);
            notificationChanged(!notificationValue);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setSelctedDateReceived(date);
    } else {
      if (!isSwitchOn) {
        try {
          const dateApp = moment(date, "YYYY-MM-DD");

          const diffInDays = dateApp.diff(actualDateMoment, "days");
          let notificationId1,
            notificationId2 = "";
          const appointmentDate = new Date(date);
          const reminderDate1 = new Date(appointmentDate);
          reminderDate1.setDate(appointmentDate.getDate() - 7);
          const reminderDate2 = new Date(appointmentDate);
          reminderDate2.setDate(appointmentDate.getDate() - 1);
          console.log(diffInDays);
          if (active) {
            if (diffInDays >= 7)
              notificationId1 = await scheduleNotificationHandler(
                "Reminder! 🕒",
                `You have an appointment for ${name} on ${new Date(
                  date
                ).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`,
                new Date(
                  `${getFormattedDate(new Date(reminderDate1))} ${
                    actualDate.getUTCHours() + 1
                  }:00:00 `
                )
              );
            if (diffInDays >= 1)
              notificationId2 = await scheduleNotificationHandler(
                "Reminder! 🕒",
                `You have an appointment for ${name} on ${new Date(
                  date
                ).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`,
                new Date(
                  `${getFormattedDate(new Date(reminderDate2))} ${
                    actualDate.getUTCHours() + 1
                  }:00:00`
                )
              );
          } else {
            if (diffInDays >= 7)
              notificationId1 = await scheduleNotificationHandler(
                "Reminder! 🕒",
                `Your vet recommends an appointment for ${name} on ${new Date(
                  date
                ).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`,
                new Date(
                  `${getFormattedDate(new Date(reminderDate1))} ${
                    actualDate.getUTCHours() + 1
                  }:00:00`
                )
              );
            if (diffInDays >= 1)
              notificationId2 = await scheduleNotificationHandler(
                "Reminder! 🕒",
                `Your vet recommends an appointment for ${name} on ${new Date(
                  date
                ).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`,
                new Date(
                  `${getFormattedDate(new Date(reminderDate2))} ${
                    actualDate.getUTCHours() + 1
                  }:00:00`
                )
              );
          }
          const resp = await addNotificationAppointment(
            authCtx.uid,
            aid,
            date,
            name,
            active ? true : false,
            active ? slot : undefined,
            [notificationId1, notificationId2]
          );
          notificationChanged(!notificationValue);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          if (generatedId) {
            console.log(notificationId, "idss");
            await cancelNotification(notificationId[0][0]);
            await cancelNotification(notificationId[0][1]);
            const resp = await deleteNotificationAppointment(generatedId);
            notificationChanged(!notificationValue);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setSelctedDateReceived(date);
    }
  };
  let disabled = false;
  const actualDate = new Date(romanianTime);
  const selectDate = new Date(date);
  if (appointmentReminder === null) {
    console.log(actualDate.getUTCHours());
    if (getFormattedDate(actualDate) > getFormattedDate(selectDate))
      disabled = true;
    if (getFormattedDate(actualDate) === getFormattedDate(selectDate)) {
      if (
        momentTime === "Morning" &&
        actualDate.getUTCHours() >= 8 &&
        actualDate.getMinutes() > 0
      )
        disabled = true;
      if (
        momentTime === "Lunch" &&
        actualDate.getUTCHours() >= 13 &&
        actualDate.getMinutes() > 0
      )
        disabled = true;
      if (
        momentTime === "Evening" &&
        actualDate.getUTCHours() >= 20 &&
        actualDate.getMinutes() > 0
      )
        disabled = true;
    }
  } else {
    if (getFormattedDate(actualDate) > getFormattedDate(selectDate))
      disabled = true;
  }

  console.log(actualDate.getDate(), selectDate.getUTCDate());
  return (
    <Switch
      value={isSwitchOn}
      disabled={disabled}
      onValueChange={onToggleSwitch}
      color={GlobalColors.colors.pink500}
      style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
    />
  );
}

export default Switcher;
