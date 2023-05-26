import { Switch } from "react-native-paper";
import { useState, useContext, useEffect, useLayoutEffect } from "react";
import { GlobalColors } from "../../constants/colors";
import { sendPushNotificationHandler } from "../../notifications/notifications";
import { AuthContext } from "../../context/auth";
import { getTime } from "date-fns";
import {
  addNotification,
  deleteNotification,
  addNotificationAppointment,
  deleteNotificationAppointment,
} from "../../store/databases";
function Switcher({
  aid,
  name,
  momentTime,
  pill,
  date,
  status,
  notificationChanged,
  notificationValue,
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
  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    if (appointmentReminder === null) {
      if (!isSwitchOn) {
        try {
          const resp = await addNotification(
            authCtx.uid,
            aid,
            momentTime,
            pill,
            date,
            name
          );

          notificationChanged(!notificationValue);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          if (generatedId) {
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
          const resp = await addNotificationAppointment(
            authCtx.uid,
            aid,
            date,
            name,
            active ? true : false,
            active ? slot : undefined
          );
          notificationChanged(!notificationValue);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          if (generatedId) {
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

  return (
    <Switch
      value={isSwitchOn}
      onValueChange={onToggleSwitch}
      color={GlobalColors.colors.pink500}
      style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
    />
  );
}

export default Switcher;
