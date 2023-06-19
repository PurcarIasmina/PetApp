import { View, Image, StyleSheet, Text } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { getAge, getRomanianTime } from "../../util/date";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { getUserDetails } from "../../store/databases";
function AppointmentCard({ appointment }) {
  console.log(appointment);
  const actualTime = getRomanianTime().toISOString().slice(11, 16);
  const actualDate = getRomanianTime().toISOString().slice(0, 10);
  const navigation = useNavigation();
  console.log(appointment);
  const [docDetails, setDocDetails] = useState({});
  console.log(appointment);
  useEffect(() => {
    async function getDocNm() {
      try {
        const resp = await getUserDetails(appointment.did);
        setDocDetails(resp);
      } catch (error) {
        console.log(error);
      }
    }
    getDocNm();
  }, []);
  let html = ``;
  if (appointment.result) {
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
									Date of appointment: ${new Date(appointment.date).toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} </br>
									Next appointment suggestion: ${new Date(
                    appointment.result?.nextAppointment.replace(/\//g, "-")
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
					<td>Patient Details</td>

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
									Date of appointment: ${new Date(appointment.date).toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} </br>
									Next appointment suggestion: ${new Date(
                    appointment.result.nextAppointment.replace(/\//g, "-")
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
					<td>Patient Details</td>

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

    console.log(html);
  }
  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };
  console.log(appointment.slot.slice(0, 5));
  return (
    <View>
      <View style={styles.elementContainer}>
        <View
          style={{
            maxHeight: 100,
            overflow: "hidden",
            borderRadius: 30,
            alignSelf: "center",
          }}
        >
          <Image style={styles.image} source={{ uri: appointment.photoUrl }} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{appointment.animal.nameA}</Text>
          <Text style={[styles.name, { fontSize: 13 }]}>
            Owner: {appointment.ownername}
          </Text>
          <Text style={styles.date}>{`${
            getAge(appointment.animal.date).years
          }y ${getAge(appointment.animal.date).months}m ${
            getAge(appointment.animal.date).days
          }d`}</Text>
          <Text
            style={[
              styles.date,
              { color: GlobalColors.colors.mint1, marginTop: 3 },
            ]}
          >
            Reason: {appointment.reason}
          </Text>
          <Text
            style={[
              styles.date,
              { color: GlobalColors.colors.mint1, marginTop: 2 },
            ]}
          >
            {appointment.date} {appointment.slot}
          </Text>

          {(actualDate > appointment.date ||
            (actualDate === appointment.date &&
              actualTime > appointment.slot.slice(0, 5))) && (
            <View style={styles.uploadContainer}>
              {appointment.done === 0 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AppointmentResult", {
                      appointment: appointment,
                    })
                  }
                >
                  <FontAwesome
                    color={GlobalColors.colors.pink500}
                    name={"upload"}
                    size={20}
                  />
                </TouchableOpacity>
              )}
              {appointment.done === 1 && (
                <MaterialCommunityIcon
                  color={GlobalColors.colors.pink500}
                  name={"archive-check-outline"}
                  size={20}
                  onPress={generatePdf}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
export default AppointmentCard;
const styles = StyleSheet.create({
  elementContainer: {
    backgroundColor: GlobalColors.colors.white1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 30,
    height: 140,
    width: 350,
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginHorizontal: 15,
    alignSelf: "center",
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: GlobalColors.colors.white1,
    marginHorizontal: 20,
    marginTop: 10,
  },
  name: {
    fontSize: 20,

    color: GlobalColors.colors.pink500,
    paddingHorizontal: 10,
    fontFamily: "Roboto-Regular",
    marginBottom: 5,
    left: -10,
  },
  date: {
    fontSize: 16,
    color: GlobalColors.colors.gray10,
    fontFamily: "Garet-Book",
  },
  uploadContainer: {
    position: "absolute",
    top: -2,
    alignSelf: "flex-end",
    right: -2,
  },
});
