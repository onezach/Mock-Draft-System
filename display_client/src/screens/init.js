import { useState } from "react";

const DisplayInitializationScreen = (props) => {
  const [draftCode, setDraftCode] = useState("");
  const [error, setError] = useState("");

  const processError = (error) => {
    // no response from server
    if (error === -1) {
      setError("not connected to server");
      // console.log("not connected to server");
    }

    // invalid draft code
    else if (error === 100) {
      setError("invalid draft code");
      // console.log("invalid draft code");
    }

    // unknown error
    else {
      setError("unknown error");
      // console.log("unknown error");
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
          setError("");
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
    <div className="Init-container">
      <div className="Init-item">
        <label htmlFor="display_draft_code">Enter Draft Code</label>
      </div>
      <div className="Init-item">
        <input
          id="display_draft_code"
          name="display_draft_code"
          className="Init-input"
          value={draftCode}
          onChange={(e) => setDraftCode(e.target.value)}
          maxLength={8}
          placeholder="abcd1234"
          autoComplete="off"
        />
      </div>
      {error !== "" && <div style={{color: "red"}}>* {error} *</div>}
      <div className="Init-item">
        <input
          type="button"
          className="Init-connect"
          value="Connect!"
          onClick={connect}
          disabled={draftCode.length !== 8}
        />
      </div>
    </div>
  );
};

export default DisplayInitializationScreen;
