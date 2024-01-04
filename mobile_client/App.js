import { StyleSheet } from "react-native";
import { useState } from "react";
import DraftScreen from "./screens/draft";

export default function App() {
  const [screen, setScreen] = useState("draft");

  return <DraftScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
