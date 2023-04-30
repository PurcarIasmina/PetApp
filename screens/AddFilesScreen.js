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
import { useRoute } from "@react-navigation/native";
import { Button, TouchableRipple } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { GlobalColors } from "../constants/colors";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
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
  });

  const route = useRoute();
  const [uploading, setUploading] = useState(false);
  const [progress, setUploadProgress] = useState(0);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [done, setDone] = useState(false);
  const [url, setUrl] = useState("");
  const [document, setDocument] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [deleteFile, setDeleteFile] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deleteFinished, setDeleteFinished] = useState(false);

  console.log(documents);
  useEffect(() => {
    async function getDocuments() {
      try {
        setFetching(true);
        let resp = [];
        resp = await getAnimalDocuments(authCtx.uid, route.params.aid);
        setDocuments(resp);
        console.log(progress);
        setDeleteFile(false);
        setFetching(false);
        setDeleteFinished(true);
      } catch (error) {
        console.log(error);
      }
    }
    getDocuments();
  }, [deleteFile, deleteFinished]);

  useEffect(() => {
    if (Object.keys(document).length > 0) {
      setLoading(true);
      setDocuments((documents) => [...documents, document]);
      setUploadProgress(0);
      setTimeout(function () {
        setLoading(false);
        setDocument({});
      }, 10000);
    }
  }, [document]);
  let newDocument = {};
  const deleteDoc = (name) => {
    setShowAlert(false);
    console.log(name);
    deleteFileFunction(name).then(() => setDeleteFile(true));
  };
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

      const uploadedUrl = await uploadDocument(
        result.uri,
        `documents/${authCtx.uid}/${route.params.aid}/${result.name}`,
        (progress) => setUploadProgress(progress)
      );
      const fileNameParts = result.name.split(".");
      const extension = fileNameParts[fileNameParts.length - 1];

      console.log(uploadedUrl);
      setUploadProgress(0);
      setUrl(uploadedUrl);
      setDocument({
        name: result.name,
        url: uploadedUrl,
        type: extension,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDone(!done);
    }
  };
  const openFile = async (document) => {
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

      <FlatList
        data={documents}
        renderItem={({ item, index }) => (
          <>
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
                    style={{ marginRight: 10 }}
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
                  style={{ top: 2 }}
                />

                <Text
                  style={[styles.docStyle, { marginRight: loading ? 20 : 10 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <MaterialCommunityIcon
                name={"delete-circle"}
                size={20}
                color={GlobalColors.colors.gray10}
                style={{ position: "absolute", top: -45, left: 5 }}
                onPress={() => {
                  setShowAlert(true);
                }}
              />
            </View>
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
              onConfirmPressed={deleteDoc.bind(
                this,
                `documents/${authCtx.uid}/${route.params.aid}/${item.name}`
              )}
            />
          </>
        )}
      ></FlatList>
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
