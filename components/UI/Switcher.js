import { Switch } from "react-native-paper";
import { useState, useContext } from "react";
import { GlobalColors } from "../../constants/colors";
import { sendPushNotificationHandler } from "../../notifications/notifications";
import { AuthContext } from "../../context/auth";
import { getTime } from "date-fns";
import { addNotification, deleteNotification } from "../../store/databases";
function Switcher({
  aid,
  momentTime,
  pill,
  date,
  status,
  notificationChanged,
  notificationValue,
  generatedId,
  setSelctedDateReceived,
}) {
  const [isSwitchOn, setIsSwitchOn] = useState(status);
  const authCtx = useContext(AuthContext);
  console.log(generatedId);
  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    if (!isSwitchOn) {
      try {
        const resp = await addNotification(
          authCtx.uid,
          aid,
          momentTime,
          pill,
          date
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
