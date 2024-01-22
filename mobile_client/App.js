import { StyleSheet } from "react-native";
import { useState } from "react";

import DraftScreen from "./screens/draft_client";
import InitializationScreen from "./screens/init";

const SERVER_URL = "http://192.168.1.189:5000";

export default function App() {
  const [screen, setScreen] = useState("init");
  const [draftCode, setDraftCode] = useState(0);

  const handleDraftStart = (code) => {
    console.log(code);
    setDraftCode(code);
    setScreen("draft");
  };

  const onReset = () => {
    console.log("reset triggered");
    setDraftCode(0);
    setScreen("init");
  };

  if (screen === "draft") {
    return (
      <DraftScreen
        draftCode={draftCode}
        serverURL={SERVER_URL}
        onReset={onReset}
      />
    );
  }

  return (
    <InitializationScreen
      startDraft={handleDraftStart}
      serverURL={SERVER_URL}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
