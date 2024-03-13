import CountingScreen from "@/components/screens/CountingScreen";
import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";
import { SafeAreaView, Text, View } from "react-native";

const Counting = () => {
  return (
    <Fragment>
      <StatusBar backgroundColor="#084570" />
      <CountingScreen />
    </Fragment>
  );
};

export default Counting;
