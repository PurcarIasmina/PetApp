import { View, StyleSheet, Text, Image } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { printToFileAsync } from "expo-print";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { shareAsync } from "expo-sharing";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
function AppointmentHistoryCard({ appointment, docDetails }) {
  let html = ``;
  if (appointment.result.doctorReason === "Consultation") {
    html = `
      <html>
      <head>
          <meta charset="utf-8" />
          <title>Appointment</title>
  
          <style>
              .consultation-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #eee;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                  font-size: 16px;
                  line-height: 24px;
                  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                  color: #555;
              }
  
              .consultation-box table {
                  width: 100%;
                  line-height: inherit;
                  text-align: left;
              }
  
              .consultation-box table td {
                  padding: 5px;
                  vertical-align: top;
              }
  
              .consultation-box table tr td:nth-child(2) {
                  text-align: right;
              }
  
              .consultation-box table tr.top table td {
                  padding-bottom: 20px;
              }
  
              .consultation-box table tr.top table td.title {
                  font-size: 45px;
                  line-height: 45px;
                  color: #333;
              }
  
              .consultation-box table tr.information table td {
                  padding-bottom: 40px;
              }
  
              .consultation-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
              }
  
              .consultation-box table tr.details td {
                  padding-bottom: 20px;
              }
  
              .consultation-box table tr.item td {
                  border-bottom: 1px solid #eee;
              }
  
              .consultatione-box table tr.item.last td {
                  border-bottom: none;
              }
  
              .consultation-box table tr.total td:nth-child(2) {
                  border-top: 2px solid #eee;
                  font-weight: bold;
              }
  
              @media only screen and (max-width: 600px) {
                  .consultation-box table tr.top table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                  }
  
                  .consultation-box table tr.information table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                  }
              }
  
          
              .consultation-box.rtl {
                  direction: rtl;
                  font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              }
  
              .consultation-box.rtl table {
                  text-align: right;
              }
  
              .consultation-box.rtl table tr td:nth-child(2) {
                  text-align: left;
              }
          </style>
      </head>
  
      <body>
          <div class="consultation-box">
              <table cellpadding="0" cellspacing="0">
                  <tr class="top">
                      <td colspan="2">
                          <table>
                              <tr>
                                  <td class="title">
                                      <img src="https://i.ibb.co/zVdXbpw/Untitled-1.png" style="width: 100%; max-width: 300px" />
                                  </td>
  
                                  <td>
                                  </br>
                                  </br>
                                      Date of appointment: ${new Date(
                                        appointment.date
                                      ).toLocaleDateString("en", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })} </br>
                                      Next appointment suggestion: ${new Date(
                                        appointment.result.nextAppointment.replace(
                                          /\//g,
                                          "-"
                                        )
                                      ).toLocaleDateString("en", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
  
                  <tr class="information">
                      <td colspan="2">
                          <table>
                              <tr>
                                  
                                  <td>
                                      Healthy PetApp<br />
                                      Doctor ${docDetails.name}<br />
                                      ${docDetails.email}
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
  
                  <tr class="heading">
                      <td>Animal Details</td>
  
                      <td></td>
                  </tr>
  
                  <tr class="item">
                      <td>Name</td>
  
                      <td>${appointment.animal.nameA}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Breed</td>
  
                      <td>${appointment.animal.breed}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Date of birth</td>
  
                      <td>${appointment.animal.date}</td>
                  </tr>
                  
                  <tr class="item">
                      <td>Gender</td>
  
                      <td>${appointment.animal.gender}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Owner</td>
  
                      <td>${appointment.ownername}</td>
                  </tr>
                  
                      <tr class="item">
                      <td>Diagnostic</td>
  
                      <td>${appointment.result.diagnostic}</td>
                  </tr>
                      <tr class="item last">
                      <td>Appointment Reason</td>
  
                      <td>Consultation</td>
                  </tr>
                  <tr class="heading">
                      <td>Medication</td>
  
                      <td>Plan</td>
                  </tr>
  
                  
                      ${appointment.result.pillsPlan
                        .map((pill) => {
                          return `
                      <tr class="item">
                          <td>${pill.pillName}</td>
                          <td>${pill.pillTimes} days / ${
                            pill.pillMomentDay.Morning ? "Morning " : ""
                          } ${pill.pillMomentDay.Lunch ? "Lunch " : ""} ${
                            pill.pillMomentDay.Evening ? "Evening " : ""
                          }/ ${pill.pillCount} ${
                            pill.pillCount === 1 ? "pill" : "pills"
                          }</td>
                      
                          </tr>
                          <tr class="item">
    
    <td>Additional info: ${
      pill.additionalInfo !== "" ? pill.additionalInfo : "-"
    }</td>
  </tr>
                         
                     `;
                        })
                        .join("")}
  
              </table>
          </div>
      </body>
  </html>`;
  } else {
    html = `
      <html>
      <head>
          <meta charset="utf-8" />
          <title>Appointment</title>
  
          <style>
              .consultation-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #eee;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                  font-size: 16px;
                  line-height: 24px;
                  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                  color: #555;
              }
  
              .consultation-box table {
                  width: 100%;
                  line-height: inherit;
                  text-align: left;
              }
  
              .consultation-box table td {
                  padding: 5px;
                  vertical-align: top;
              }
  
              .consultation-box table tr td:nth-child(2) {
                  text-align: right;
              }
  
              .consultation-box table tr.top table td {
                  padding-bottom: 20px;
              }
  
              .consultation-box table tr.top table td.title {
                  font-size: 45px;
                  line-height: 45px;
                  color: #333;
              }
  
              .consultation-box table tr.information table td {
                  padding-bottom: 40px;
              }
  
              .consultation-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
              }
  
              .consultation-box table tr.details td {
                  padding-bottom: 20px;
              }
  
              .consultation-box table tr.item td {
                  border-bottom: 1px solid #eee;
              }
  
              .consultatione-box table tr.item.last td {
                  border-bottom: none;
              }
  
              .consultation-box table tr.total td:nth-child(2) {
                  border-top: 2px solid #eee;
                  font-weight: bold;
              }
  
              @media only screen and (max-width: 600px) {
                  .consultation-box table tr.top table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                  }
  
                  .consultation-box table tr.information table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                  }
              }
  
          
              .consultation-box.rtl {
                  direction: rtl;
                  font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              }
  
              .consultation-box.rtl table {
                  text-align: right;
              }
  
              .consultation-box.rtl table tr td:nth-child(2) {
                  text-align: left;
              }
          </style>
      </head>
  
      <body>
          <div class="consultation-box">
              <table cellpadding="0" cellspacing="0">
                  <tr class="top">
                      <td colspan="2">
                          <table>
                              <tr>
                                  <td class="title">
                                      <img src="https://i.ibb.co/zVdXbpw/Untitled-1.png" style="width: 100%; max-width: 300px;" />
                                  </td>
  
                                  <td>
                                  </br>
                                  </br>
                                      Date of appointment: ${new Date(
                                        appointment.date
                                      ).toLocaleDateString("en", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })} </br>
                                      Next appointment suggestion: ${new Date(
                                        appointment.result.nextAppointment.replace(
                                          /\//g,
                                          "-"
                                        )
                                      ).toLocaleDateString("en", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
  
                  <tr class="information">
                      <td colspan="2">
                          <table>
                              <tr>
                                  
                                  <td>
                                      Healthy PetApp<br />
                                      Doctor ${docDetails.name}<br />
                                      ${docDetails.email}
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
  
                  <tr class="heading">
                      <td>Animal Details</td>
  
                      <td></td>
                  </tr>
  
                  <tr class="item">
                      <td>Name</td>
  
                      <td>${appointment.animal.nameA}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Breed</td>
  
                      <td>${appointment.animal.breed}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Date of birth</td>
  
                      <td>${appointment.animal.date}</td>
                  </tr>
                  
                  <tr class="item">
                      <td>Gender</td>
  
                      <td>${appointment.animal.gender}</td>
                  </tr>
  
                  <tr class="item">
                      <td>Owner</td>
  
                      <td>${appointment.ownername}</td>
                  </tr>
                  
                      
                      <tr class="item last">
                      <td>Appointment Reason</td>
  
                      <td>${appointment.result.doctorReason}</td>
                  </tr>
                  <tr class="heading">
                      <td>Doses</td>
  
                      <td>Plan</td>
                  </tr>
  
                  
                      ${appointment.result.appointmentDoses
                        .map((pill) => {
                          return `
                      <tr class="item">
                          <td>${pill.doseName}</td>
                          <td>${pill.doseQuantity}  ${
                            pill.doseQuantity == 1 ? "dose" : "doses"
                          } / Lot: ${pill.doseNumber}/ Administration: ${
                            pill.administration
                          }
                          </td>
                         
                         
                      </tr>
                      <tr class="item">
                      <td>Additional info: ${
                        pill.additionalInfo !== "" ? pill.additionalInfo : "-"
                      }</td>
                      </tr>
                  
                  `;
                        })
                        .join("")}
              
                  
                  
  
                      
                  </tr>
  
              </table>
          </div>
      </body>
  </html>`;
  }

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={generatePdf}>
        <Image style={styles.image} source={require("../../images/pdf.png")} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        {/* <Text
          style={[styles.infoStyle, { color: GlobalColors.colors.pink500 }]}
        >
          {appointment.result.doctorReason}
        </Text> */}
        <Text
          style={[styles.infoStyle, { color: GlobalColors.colors.pink500 }]}
        >
          {new Date(appointment.date).toDateString()}, {appointment.slot}
        </Text>
        {/* <View style={styles.iconInfoInput}>
          <Ionicons
            name="time-outline"
            size={15}
            color={GlobalColors.colors.darkGrey}
            style={styles.iconInfo}
          />
          <Text style={styles.infoStyle}>{appointment.slot}</Text>
        </View> */}
        <View style={styles.iconInfoInput}>
          <Ionicons
            name="paw-outline"
            size={15}
            color={GlobalColors.colors.darkGrey}
            style={styles.iconInfo}
          />
          <Text style={styles.infoStyle}>{appointment.animal.nameA}</Text>
        </View>
        <View style={styles.iconInfoInput}>
          <Ionicons
            name="person-outline"
            size={15}
            color={GlobalColors.colors.darkGrey}
            style={styles.iconInfo}
          />
          <Text style={styles.infoStyle}>{appointment.ownername}</Text>
        </View>
      </View>
    </View>
  );
}
export default AppointmentHistoryCard;
const styles = StyleSheet.create({
  card: {
    height: 120,
    // backgroundColor: GlobalColors.colors.gray0,
    // marginVertical: 10,
    // borderRadius: 10,
    marginHorizontal: 10,
    // marginHorizontal: 20,
    // shadowColor: GlobalColors.colors.gray1,
    // shadowOffset: { width: -2, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 0.3,
    // elevation: 5,
    borderBottomWidth: 1,
    borderColor: GlobalColors.colors.gray10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    flexDirection: "column",
    marginLeft: 70,
    justifyContent: "center",
  },
  infoStyle: {
    fontFamily: "Garet-Book",
    fontSize: 15,
    color: GlobalColors.colors.darkGrey,
  },
  icon: {
    position: "absolute",
  },
  iconInfo: {
    marginRight: 8,
    top: 3,
  },
  iconInfoInput: {
    flexDirection: "row",
  },
});
