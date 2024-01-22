import "./App.scss";

import { useState } from "react";

import Display from "./screens/display";
import DisplayInitializationScreen from "./screens/init";

function App() {
  const SERVER_URL = "http://192.168.1.189:5000";

  const [screen, setScreen] = useState("init");
  const [draftCode, setDraftCode] = useState(0);

  const onReset = () => {
    console.log("reset triggered");
    setDraftCode(0);
    setScreen("init");
  };

  const showDraft = (draftCode) => {
    setDraftCode(draftCode);
    setScreen("display");
  };

  if (screen === "display") {
    return (
      <Display draftCode={draftCode} serverURL={SERVER_URL} onReset={onReset} />
    );
  }

  return (
    <DisplayInitializationScreen showDraft={showDraft} serverURL={SERVER_URL} />
  );
}

export default App;
