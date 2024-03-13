import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AiquaLogo from "@/assets/images/aiqua_s_white.svg";
import { ChevronLeft, Loader2, LucideIcon } from "lucide-react-native";
import { Camera } from "expo-camera";

import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { robo_flow_endpoint } from "@/lib/config";

const data = [
  { key: "tiger", value: "Tiger" },
  { key: "vannamei", value: "Vannamei" },
];

import { cssInterop } from "nativewind";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/components/store/atoms";
function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Loader2);

const CountingScreen = () => {
  const userId = useRecoilValue(userIdState);

  const [selected, setSelected] = useState("vannamei");
  const cameraRef = useRef<Camera>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);

  const [resultImage, setResultImage] = useState<any>(null);
  const [detections, setDetections] = useState<any>(null);

  useEffect(() => {
    (async () => {
      requestPermission();
    })();
  }, []);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
    }
  };

  const handleRecapture = async () => {
    setCapturedImage(null);
    setDetections(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        // uri: submitImage,
        uri: capturedImage,
        type: "image/jpeg",
        name: "captured_image.jpeg",
      } as unknown as File);
      formData.append("user_id", userId);
      formData.append("model_name", selected);

      const response = await fetch(`${robo_flow_endpoint}/process_and_predict`, {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      setResultImage(responseData.message);
      setDetections(responseData.count);
    } catch (error) {
      console.error("Error getting final data:", error);
      alert("Unable to fetch data, please try later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="h-28 bg-primary border border-primary rounded-b-3xl flex flex-row justify-between items-center px-4">
        <TouchableOpacity
          className="flex flex-row justify-center items-center"
          onPress={() => router.push("/")}
        >
          <ChevronLeft color={"white"} size={18} strokeWidth={3} />
          <Text style={styles.headerText} className="text-white pl-2">
            Counting
          </Text>
        </TouchableOpacity>
        <AiquaLogo height={50} width={50} />
      </View>

      <SelectList
        boxStyles={{
          marginHorizontal: 20,
          marginVertical: 5,
          borderWidth: 0.5,
          borderRadius: 5,
          backgroundColor: "#F5F8FA",
        }}
        inputStyles={{
          fontFamily: "Poppins_600SemiBold",
          color: "#084570",
        }}
        dropdownStyles={{
          marginHorizontal: 20,
          borderWidth: 0.5,
          borderRadius: 5,
        }}
        dropdownTextStyles={{
          fontFamily: "Poppins_500Medium",
          color: "#666666",
        }}
        setSelected={(val: string) => setSelected(val)}
        arrowicon={
          <FontAwesome
            name="chevron-down"
            size={12}
            color={"#084570"}
            style={{ marginTop: 5 }}
          />
        }
        defaultOption={{
          key: "vannamei",
          value: "Vannamei",
        }}
        data={data}
        save="value"
        search={false}
        placeholder="Select Type"
      />

      <View style={styles.container}>
        <View style={styles.content}>
          {!!capturedImage && !detections && (
            <View style={{ flex: 1, marginVertical: 40 }}>
              <View
                style={{
                  height: Dimensions.get("window").width - 40,
                  width: Dimensions.get("window").width - 40,
                  overflow: "hidden",
                  borderRadius: 170,
                  borderBlockColor: "#084570",
                  borderWidth: 2,
                }}
              >
                <Image source={{ uri: capturedImage }} style={styles.image} />
              </View>
              {!loading && (
                <View style={styles.buttonGroup}>
                  <Button
                    className="bg-secondary border border-primary"
                    onPress={handleRecapture}
                  >
                    <Text
                      className="text-primary"
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                    >
                      Recapture
                    </Text>
                  </Button>
                  <Button onPress={handleSubmit}>
                    <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Submit</Text>
                  </Button>
                </View>
              )}
            </View>
          )}
          {!capturedImage && (
            <View style={{ flex: 1, marginVertical: 40 }}>
              <View
                style={{
                  height: Dimensions.get("window").width - 40,
                  width: Dimensions.get("window").width - 40,
                  overflow: "hidden",
                  borderRadius: 170,
                  borderBlockColor: "#084570",
                  borderWidth: 2,
                }}
              >
                <Camera
                  // className="w-full aspect-square border rounded-full"
                  style={[
                    styles.camera,
                    // { marginTop: imagePadding, marginBottom: imagePadding },
                  ]}
                  //   onCameraReady={setCameraReady}
                  //   ratio={ratio}
                  ref={cameraRef}
                  // ratio="1:1"
                />
              </View>
              <Button className="my-10" onPress={handleCaptureImage}>
                <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Capture</Text>
              </Button>
            </View>
          )}
          {loading && (
            <View className="flex justify-center items-center mb-24">
              <Loader2
                size={40}
                color={"black"}
                strokeWidth={3}
                className="animate-spin"
              />
            </View>
          )}
          {!loading && !!detections && (
            <View style={styles.decodedContent}>
              <Image source={{ uri: resultImage }} style={styles.image} />
              <Text
                className="pt-8 text-primary"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Count
              </Text>
              <Text
                className="text-primary text-3xl mb-16"
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                {detections}
              </Text>
              <Button
                className="bg-secondary border border-primary"
                onPress={handleRecapture}
              >
                <Text
                  className="text-primary"
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Recapture
                </Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    // width: "100%",
    marginHorizontal: 20,
  },
  image: {
    width: Dimensions.get("window").width - 40,
    // height: Dimensions.get("window").width - 40,
    // aspectRatio: 3 / 4,
    aspectRatio: 1,
    borderRadius: 170,
    resizeMode: "cover",
    alignSelf: "flex-start",

    // marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  camera: {
    // flex: 1,
    // height: Dimensions.get("window").width - 40,
    width: Dimensions.get("window").width - 40,
    overflow: "hidden",
    borderRadius: 170,
    // width: "100%",
    // aspectRatio: 3 / 4,
    aspectRatio: 1,
    // marginBottom: 10,
    // borderRadius: 50,
    // objectFit: "cover",
  },
  captureButton: {
    alignSelf: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
    marginBottom: 10,
  },
  captureText: {
    fontSize: 20,
    color: "black",
  },
  decodedContent: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default CountingScreen;
