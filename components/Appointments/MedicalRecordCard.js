import { View, StyleSheet, Text, Image } from "react-native";
import { GlobalColors } from "../../constants/colors";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import {
  getDoctorDetails,
  getUserName,
  getAnimalDetails,
  getUserDetails,
} from "../../store/databases";
import LoadingOverlay from "../UI/LoadingOverlay";
import { ScrollView } from "react-native-gesture-handler";
import Feather from "react-native-vector-icons/Feather";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { getFormattedDate } from "../../util/date";
function formatDate(dateString) {
  if (dateString) {
    const dateObj = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  } else return "";
}
function MedicalRecordCard({ appointment, status }) {
  //   console.log(appointment);
  const [docDetails, setDocDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  const [animalDetails, setAnimalDetails] = useState({});
  useEffect(() => {
    async function getDocNm() {
      try {
        setFetching(true);
        const resp = await getUserDetails(appointment.did);
        console.log(resp);
        setDocDetails(resp);

        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getDocNm();
  }, []);
  useEffect(() => {
    async function getAnimalDetail() {
      try {
        setFetching(true);

        const resp = await getAnimalDetails(appointment.aid);
        console.log(resp);
        setAnimalDetails(resp);
        console.log(docName);
        setFetching(false);
      } catch (error) {
        console.log(error);
      }
    }
    getAnimalDetail();
  }, []);

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

					<td>${animalDetails.nameA}</td>
				</tr>

				<tr class="item">
					<td>Breed</td>

					<td>${animalDetails.breed}</td>
				</tr>

				<tr class="item">
					<td>Date of birth</td>

					<td>${animalDetails.date}</td>
				</tr>
				
				<tr class="item">
					<td>Gender</td>

					<td>${animalDetails.gender}</td>
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

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.cardContainer}>
      <Feather
        name="download"
        onPress={generatePdf}
        color={GlobalColors.colors.blue10}
        style={{
          position: "absolute",
          left: 5,
          top: 5,
        }}
        size={18}
      />
      <View style={{ flexDirection: "column" }}>
        <View style={styles.shortDate}>
          <Text style={styles.textDate}>{formatDate(appointment.date)}</Text>
        </View>

        <View style={styles.dateContainer}>
          <MaterialCommunityIcon
            name="clock-outline"
            size={15.5}
            color={GlobalColors.colors.pink500}
            style={{ paddingHorizontal: 8, top: 1.5, marginRight: 6 }}
          />
          <Text style={styles.diagnostic}>{appointment.slot}</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, left: -5 }}>
          <Icon
            name="user-md"
            size={15.5}
            color={GlobalColors.colors.pink500}
            style={{ marginTop: 2, paddingHorizontal: 7, marginRight: 8 }}
          />
          <Text style={[styles.diagnostic, { fontSize: 16 }]}>
            {docDetails.name}
          </Text>
        </View>
        {appointment.result.nextAppointment.length > 0 && (
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Icon
              name="arrow-right"
              size={11}
              color={GlobalColors.colors.pink500}
              style={{ marginTop: 5, left: 12 }}
            />
            <Icon
              name="calendar"
              size={13.5}
              color={GlobalColors.colors.pink500}
              style={{
                marginTop: 2,
                paddingRight: 7,

                left: -8,
              }}
            />
            <Text style={[styles.diagnostic, { fontSize: 16 }]}>
              {formatDate(appointment.result.nextAppointment)}
            </Text>
          </View>
        )}
      </View>
      <View style={{ marginTop: 25, left: 30 }}>
        <View style={{ alignItems: "center", marginLeft: 20 }}>
          {appointment.result.diagnostic && (
            <Text style={[styles.diagnostic, { marginLeft: -20, bottom: 10 }]}>
              Diagnostic: {appointment.result.diagnostic}
            </Text>
          )}
          {appointment.result.doctorReason.localeCompare("Vaccine") === 0 && (
            <View style={{ flexDirection: "row", left: -20, bottom: 10 }}>
              <Text style={styles.diagnostic}>Vaccine Plan</Text>
              <MaterialCommunityIcon
                name={"pill"}
                size={15}
                color={GlobalColors.colors.pink500}
                style={{ paddingHorizontal: 5, top: 1 }}
              />
            </View>
          )}
          {appointment.result.doctorReason.localeCompare("Disinfestation") ===
            0 && (
            <View style={{ flexDirection: "row", left: -20, bottom: 10 }}>
              <Text style={styles.diagnostic}>Disinfestation Plan</Text>
              <MaterialCommunityIcon
                name={"pill"}
                size={15}
                color={GlobalColors.colors.pink500}
                style={{ paddingHorizontal: 5, top: 1 }}
              />
            </View>
          )}
          <ScrollView style={{ left: -15 }}>
            {appointment.result.pillsPlan && (
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.diagnostic}>Medicine Plan</Text>
                  <MaterialCommunityIcon
                    name={"pill"}
                    size={15}
                    color={GlobalColors.colors.pink500}
                    style={{ paddingHorizontal: 5, top: 1 }}
                  />
                </View>
                {appointment.result.doctorReason.localeCompare(
                  "Consultation"
                ) === 0 &&
                  appointment.result.pillsPlan.map((pill, index) => (
                    <View key={index} style={styles.pillContainer}>
                      <Text style={styles.medicineText}>
                        {pill.pillCount} x {pill.pillName}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.diagnostic}>When:</Text>
                        {pill.pillMomentDay.Morning && (
                          <MaterialCommunityIcon
                            name="coffee"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                        {pill.pillMomentDay.Lunch && (
                          <MaterialCommunityIcon
                            name="food-variant"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                        {pill.pillMomentDay.Evening && (
                          <MaterialCommunityIcon
                            name="bed-empty"
                            style={styles.iconMoment}
                            color={GlobalColors.colors.pink500}
                            size={18}
                          />
                        )}
                      </View>
                      <Text style={styles.diagnostic}>
                        How long : {pill.pillTimes} days
                      </Text>
                    </View>
                  ))}
              </View>
            )}
            {appointment.result.doctorReason.localeCompare("Consultation") !=
              0 &&
              appointment.result.appointmentDoses.map((dose, index) => (
                <View key={index} style={styles.pillContainer}>
                  <Text style={styles.medicineText}>
                    {dose.doseName} x {dose.doseQuantity} dose
                  </Text>
                  <Text style={styles.diagnostic}>Lot: {dose.doseNumber}</Text>
                  {dose.additionalInfo.length > 0 && (
                    <Text style={styles.diagnostic}>
                      Additional Info: {dose.additionalInfo}
                    </Text>
                  )}
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default MedicalRecordCard;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    height: 250,
    width: 380,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    padding: 20,
    flexDirection: "row",
  },
  diagnostic: {
    fontSize: 15,
    color: GlobalColors.colors.darkGrey,
  },
  dateContainer: {
    flexDirection: "row",
    top: 15,
    left: -8,
  },
  shortDate: {
    backgroundColor: GlobalColors.colors.pink500,
    height: 80,
    width: 80,
    borderRadius: 40,

    marginVertical: 5,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  textDate: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.gray0,
    fontSize: 16,
    textAlign: "center",
  },
  medicineText: {
    fontSize: 15,
    color: GlobalColors.colors.pink500,
  },
  iconMoment: {
    paddingHorizontal: 5,
  },
  pillContainer: {
    marginVertical: 3,
  },
});
