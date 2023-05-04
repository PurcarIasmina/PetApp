import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Button, TouchableRipple } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { GlobalColors } from "../constants/colors";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { FloatingAction } from "react-native-floating-action";
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from "expo-print";

import {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import {
  getAnimalDocuments,
  uploadDocument,
  deleteFileFunction,
} from "../store/databases";
import { AuthContext } from "../context/auth";
import { Circle } from "react-native-progress";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import AwesomeAlert from "react-native-awesome-alerts";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
const getFileIcon = (extension) => {
  switch (extension) {
    case "pdf":
      return { name: "file-pdf-o", color: "red" };
    case "jpg":
      return { name: "file-imagine-o", color: "purple" };
    case "jpeg":
      return { name: "file-imagine-o", color: "purple" };
    case "png":
      return { name: "file-imagine-o", color: "purple" };
    case "doc":
      return { name: "file-word-o", color: "blue" };
    case "docx":
      return { name: "file-word-o", color: "blue" };
    case "ppt":
      return { name: "file-powerpoint-o", color: GlobalColors.colors.red1 };
    case "pptx":
      return { name: "file-powerpoint-o", color: GlobalColors.colors.red1 };
    case "xls":
      return { name: "file-excel-o", color: GlobalColors.colors.green10 };
    case "xlsx":
      return { name: "file-excel-o", color: GlobalColors.colors.green10 };
    case "zip":
      return { name: "file-zip-o", color: "gray" };
    case "tar":
      return { name: "file-archive-o", color: GlobalColors.colors.darkGrey };
    case "rar":
      return { name: "file-archive-o", color: GlobalColors.colors.darkGrey };
    case "7z":
      return { name: "file-archive-o", color: GlobalColors.colors.darkGrey };
    default:
      return { name: "file-o", color: GlobalColors.colors.pastel1 };
  }
};

function AddFilesScreen({ navigation }) {
  const route = useRoute();
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0,
      borderBottomColor: "white",
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: "transparent",
    },
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 20, flexDirection: "row", top: 5 }}
        onPress={() => navigation.navigate("PetScreen", { ...route.params })}
      >
        <Feather
          name={"chevron-left"}
          color={GlobalColors.colors.pink500}
          size={15}
          style={{ top: 3, left: 2 }}
        />
        <Text
          style={{
            fontFamily: "Garet-Book",
            color: GlobalColors.colors.pink500,
            fontSize: 14,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    ),
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setUploadProgress] = useState(0);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [done, setDone] = useState(false);
  const [url, setUrl] = useState("");
  const [document, setDocument] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [deleteFile, setDeleteFile] = useState("");
  const [fetching, setFetching] = useState(false);
  const [deleteFinished, setDeleteFinished] = useState(false);
  const [startDelete, setStartDelete] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  useEffect(() => {
    async function getDocuments() {
      try {
        setFetching(true);
        let resp = [];
        resp = await getAnimalDocuments(authCtx.uid, route.params.aid);
        resp.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
        setDocuments(resp);
        console.log(progress);
        setDeleteFile("");
        setDeleteFinished(false);
        setFetching(false);
        setStartDelete(false);
      } catch (error) {
        console.log(error);
      }
    }
    setFetching(false);
    getDocuments();
  }, [deleteFinished]);

  useEffect(() => {
    if (startDelete === true) {
      console.log(deleteFile);
      deleteFileFunction(
        `documents/${authCtx.uid}/${route.params.aid}/${deleteFile}`
      );
      setDeleteFinished(true);
    }
  }, [startDelete]);

  useEffect(() => {
    if (Object.keys(document).length > 0) {
      setLoading(true);
      setDocuments((documents) => {
        const newDocuments = [...documents, document];
        newDocuments.sort((a, b) => a.name.localeCompare(b.name));
        return newDocuments;
      });
      console.log(documents);
      setUploadProgress(0);
      setTimeout(function () {
        setLoading(false);
        setDocument({});
      }, 10000);
    }
  }, [document]);
  let newDocument = {};
  const actions = [
    {
      text: "Button 1",
      icon: <MaterialCommunityIcon name="camera" size={24} color="#fff" />,
      name: "btn1",
      position: 1,
    },
    {
      text: "Button 2",
      icon: <MaterialCommunityIcon name="pencil" size={24} color="#fff" />,
      name: "btn2",
      position: 2,
    },
    {
      text: "Button 3",
      icon: <MaterialCommunityIcon name="folder" size={24} color="#fff" />,
      name: "btn3",
      position: 3,
    },
  ];
  const selectDoc = async () => {
    try {
      setLoading(true);
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === "success") {
        console.log(
          `Selected file - name: ${result.name}, size: ${result.size}, uri: ${result.uri}`
        );
      } else {
        setLoading(false);
      }

      const upldUrl = await uploadDocument(
        result.uri,
        `documents/${authCtx.uid}/${route.params.aid}/${result.name}`,
        (progress) => setUploadProgress(progress)
      ).then((url) => {
        console.log(url);
        const fileNameParts = result.name.split(".");
        const extension = fileNameParts[fileNameParts.length - 1];
        setDocument({
          name: result.name,
          type: extension,
          url: url,
        });
      });

      const fileNameParts = result.name.split(".");
      const extension = fileNameParts[fileNameParts.length - 1];

      setUploadProgress(0);
      setUploadedUrl(upldUrl);
      setUrl(upldUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setDone(!done);
    }
  };
  const floatingActionStyle = {
    floatingIcon: {
      width: 60,
      height: 60,
    },
    iconWidth: 60,
    iconHeight: 60,
  };

  const openFile = async (document) => {
    console.log(document);
    try {
      const supported = await Linking.canOpenURL(document);
      if (supported) {
        await Linking.openURL(document);
      } else {
        console.log("Don't know how to open URI: " + document);
      }
    } catch (error) {
      console.log("An error occurred", error);
    }
  };
  async function shareDocument(url) {
    console.log(url);
    try {
      const fileExtension = url.split(".").pop(); // Get the file extension
      const fileDirectory = FileSystem.documentDirectory; // Save the file in the app's document directory
      const fileName = `myFile.${fileExtension}`; // Set the file name
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        `${fileDirectory}${fileName}`
      );

      // Download the file to the app's document directory
      const { uri: downloadedFileUri } =
        await downloadResumable.downloadAsync();

      // Share the downloaded file
      await shareAsync(downloadedFileUri);
    } catch (error) {
      console.log("Error downloading and sharing file", error);
    }
  }
  if (fetching) return <LoadingOverlay message={"Loading..."} />;
  return (
    <View style={styles.container}>
      <Image
        style={styles.imageContainer}
        source={{ uri: route.params.photo }}
      />
      <View
        style={[
          styles.titleContainer,
          {
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            flexDirection: "column",
          },
        ]}
      >
        <View
          style={[
            styles.titleContainer,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              height: progress > 0 ? 80 : 50,
            },
          ]}
        >
          {/* <FloatingAction
            actions={actions}
            color="#2ecc71"
            onPressItem={(name) => {
              console.log(`Pressed item with name: ${name}`);
            }}
            floatingIcon={
              <MaterialCommunityIcon
                name="message-text-outline"
                size={24}
                color="#fff"
              />
            }
            floatingActionStyle={floatingActionStyle}
            distanceToEdge={10}
            overrideWithAction={true}
            floatingButtonStyle={{ width: 50, height: 50 }}
          /> */}
          <Text style={styles.title}>
            Upload files/documents for {route.params.name}{" "}
          </Text>
          <TouchableRipple onPress={selectDoc}>
            <MaterialCommunityIcon
              name="upload-outline"
              size={20}
              color={GlobalColors.colors.mint1}
            />
          </TouchableRipple>
        </View>
        {/* {loading > 0 && (
          <Circle
            size={50}
            progress={progress}
            accessibilityViewIsModal={true}
            showsText={true}
            formatText={() => `${progress}%`}
            color={"#2ecc71"}
            style={{ top: -20 }}
          />
        )} */}
      </View>
      {documents.length === 0 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Garet-Book",
              fontSize: 20,
              color: GlobalColors.colors.pink500,
            }}
          >
            No files uploaded!
          </Text>
        </View>
      )}
      <FlatList
        data={documents}
        renderItem={({ item, index }) => (
          <>
            {/* {console.log(index, item.name)} */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: GlobalColors.colors.gray0,
                borderRadius: 20,
                marginVertical: 10,
                marginLeft: 30,
                marginRight: 10,
                paddingHorizontal: 20,
                height: 55,
                alignItems: "center",
              }}
            >
              {item === document && loading && (
                <View style={styles.progressContainer}>
                  <Circle
                    size={20}
                    color={"#2ecc71"}
                    progress={progress}
                    showsText={true}
                    formatText={() => `${progress}%`}
                    style={{ marginRight: 10, left: -2 }}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={() => openFile(item.url)}
                style={{ flexDirection: "row" }}
              >
                <Icon
                  name={getFileIcon(item.type).name}
                  size={20}
                  color={getFileIcon(item.type).color}
                  style={{
                    top: 2,
                    left: item === document && loading ? -4 : 0,
                  }}
                />

                <Text
                  style={[
                    styles.docStyle,
                    {
                      marginRight: loading ? 60 : 50,
                      left: item === document && loading ? -4 : 0,
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
              <Feather
                name="share-2"
                color={GlobalColors.colors.pink500}
                onPress={shareDocument.bind(this, item.url)}
                style={{ position: "absolute", left: 363, top: 4 }}
              />
            </View>
            <View>
              <MaterialCommunityIcon
                name={"delete-circle"}
                size={20}
                color={GlobalColors.colors.gray10}
                style={{ position: "absolute", top: -45, left: 5 }}
                onPress={() => {
                  setShowAlert(true);
                  setDeleteFile(item.name);
                }}
              />
            </View>
          </>
        )}
        keyExtractor={(item) => Math.random() * 100}
      ></FlatList>
      <AwesomeAlert
        show={showAlert}
        title="Are you sure you want to delete this file?"
        titleStyle={{ color: GlobalColors.colors.pink500, fontSize: 18 }}
        showCancelButton={true}
        cancelText="No"
        cancelButtonStyle={{
          backgroundColor: GlobalColors.colors.pastel1,
          width: 80,
          alignItems: "center",
        }}
        cancelButtonTextStyle={{
          fontSize: 19,
          color: GlobalColors.colors.pink10,
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        showConfirmButton={true}
        confirmText="Yes"
        confirmButtonStyle={{
          backgroundColor: GlobalColors.colors.pink10,
          width: 85,
          alignItems: "center",
        }}
        confirmButtonTextStyle={{
          fontSize: 19,
          color: GlobalColors.colors.pastel1,
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
          setStartDelete(true);
        }}
      />
    </View>
  );
}
export default AddFilesScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "Garet-Book",
    color: GlobalColors.colors.pink500,
    size: 18,
    // textAlign: "center",
    // marginTop: 40,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    alignSelf: "center",
  },
  titleContainer: {
    backgroundColor: GlobalColors.colors.gray0,
    borderRadius: 20,

    paddingHorizontal: 20,
    justifyContent: "center",
    alignSelf: "center",
  },
  docStyle: {
    color: GlobalColors.colors.darkGrey,
    marginHorizontal: 10,

    fontSize: 16,
    fontFamily: "Garet-Book",
  },
});
