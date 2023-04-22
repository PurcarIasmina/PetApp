import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GlobalColors } from "../../constants/colors";
import { getFormattedDate } from "../../util/date";
function SwiperDays({ pills, handlerGetPills, notifications, date }) {
  const [days, setDays] = useState([]);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const timezoneOffset = 180;
  const romanianTime = currentDate.getTime() + timezoneOffset * 60 * 1000;
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [earliestPillFirstDay, setEarliestPillFirstDay] = useState(
    pills.reduce(
      (earliest, pill) =>
        earliest
          ? pill.pillFirstDay < earliest
            ? pill.pillFirstDay
            : earliest
          : pill.pillFirstDay,
      null
    )
  );
  const [latestPillLastDay, setLatestPillLastDay] = useState(
    pills.reduce(
      (latest, pill) =>
        latest
          ? pill.pillLastDay > latest
            ? pill.pillLastDay
            : latest
          : pill.pillLastDay,
      null
    )
  );

  useLayoutEffect(() => {
    let dayss = [];
    let endDate = new Date(latestPillLastDay);
    let currentDate = new Date(earliestPillFirstDay);
    while (currentDate <= endDate) {
      dayss.push(new Date(currentDate));
      currentDate.setDate(currentDate.getUTCDate() + 1);
    }

    setDays(dayss);
  }, []);

  const renderItem = (item, index) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedDate(item), handlerGetPills(getFormattedDate(item));
      }}
    >
      <View
        style={
          getFormattedDate(item) === getFormattedDate(selectedDate)
            ? [styles.containerdate, styles.selectedDate]
            : styles.containerdate
        }
        key={index}
      >
        <>
          <Text style={styles.itemWeekday}>{daysOfWeek[item.getUTCDay()]}</Text>
          <Text style={styles.itemDate}>{item.getUTCDate()}</Text>
        </>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={days}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item) => item.toISOString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

export default SwiperDays;
const styles = StyleSheet.create({
  containerdate: {
    height: 55,
    width: 60,
    marginHorizontal: 16,
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e3e3e3",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: GlobalColors.colors.gray0,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: GlobalColors.colors.pink500,
  },
  selectedDate: {
    backgroundColor: GlobalColors.colors.white1,
  },
});
