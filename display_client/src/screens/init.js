import { useState } from "react";

const DisplayInitializationScreen = (props) => {
  const [draftCode, setDraftCode] = useState("");

  const processError = (error) => {
    // no response from server
    if (error === -1) {
      console.log("not connected to server");
    }

    // invalid draft code
    else if (error === 100) {
      console.log("invalid draft code");
    }

    // unknown error
    else {
      console.log("unknown error");
    }
  };

  const connect = () => {
    fetch(props.serverURL + "/draft/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft_code: draftCode }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error === 0) {
          props.showDraft(draftCode);
        } else {
          processError(r.error);
        }
      })
      .catch(() => {
        processError(-1);
      });
  };

  return (
    <div className="Container">
      <label htmlFor="display_draft_code">Draft Code</label>
      <input
        id="display_draft_code"
        name="display_draft_code"
        size={8}
        value={draftCode}
        onChange={(e) => setDraftCode(e.target.value)}
      />
      <input type="button" value="Connect" onClick={connect} />
    </div>
  );
};

export default DisplayInitializationScreen;
