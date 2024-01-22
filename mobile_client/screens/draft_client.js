import { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  Keyboard,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import PositionButton from "../components/position_button";

import { POSITIONS, TEAMS } from "../data/static";

const DraftScreen = (props) => {
  // data from server
  const [round, setRound] = useState(1);
  const [pickNumber, setPickNumber] = useState(1);
  const [overall, setOverall] = useState(1);
  const [pickingTeam, setPickingTeam] = useState("");
  const [time, setTime] = useState(-1);
  const [clockRunning, setClockRunning] = useState(false);

  // timeout/error tracking
  const [timeout, setTimeout] = useState(0);
  const [refreshIntervalID, setRefreshIntervalID] = useState(0);

  // current pick data
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState("");
  const teamDropdownRef = useRef({});
  const [playerPosition, setPlayerPosition] = useState("");

  const reset = () => {
    setPlayerName("");
    setPlayerTeam("");
    teamDropdownRef.current.reset();
    setPlayerPosition("");
    setTimeout(0);
  };

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
    setTimeout((t) => t + 1);
  };

  const refresh = useCallback(() => {
    fetch(props.serverURL + "/draft/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft_code: props.draftCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          // update with data from server
          setRound(data.current_pick.round);
          setPickNumber(data.current_pick.number);
          setOverall(data.current_pick.overall);
          setPickingTeam(data.current_team);
          setTime(data.time_on_clock);
          setClockRunning(data.clock_running);

          // reset timeout on success
          setTimeout(0);
        } else {
          processError(data.error);
        }
      })
      .catch(() => {
        processError(-1);
      });
  }, [props.serverURL, props.draftCode]);

  const confirmDraftPick = () => {
    fetch(props.serverURL + "/client/pick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draft_code: props.draftCode,
        name: playerName.trim(),
        team: playerTeam,
        position: playerPosition,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error === 0) {
          // reset input data
          reset();
        } else {
          processError(data.error);
        }
      })
      .catch(() => {
        processError(-1);
      });
  };

  // Refreshes data from server
  useEffect(() => {
    const refreshInterval = setInterval(refresh, 500);
    setRefreshIntervalID(refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [refresh]);

  // Timeout -- if too many errors in a row (likely an invalid code), shuts down current refresh cycle
  //            and returns client to initialiation screen
  useEffect(() => {
    if (timeout > 4) {
      clearInterval(refreshIntervalID);
      props.onReset();
    }
  }, [timeout, refreshIntervalID, props]);

  const toggleClock = () =>
    fetch(props.serverURL + "/draft/toggle_clock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft_code: props.draftCode }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error == 0) {
          setTimeout(0);
        } else {
          processError(data.error);
        }
      })
      .catch(() => {
        processError(-1);
      });

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    let formattedSeconds = s.toString();
    if (formattedSeconds.length < 2) {
      formattedSeconds = "0" + formattedSeconds;
    }
    return m + ":" + formattedSeconds;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <View style={styles.pickData}>
            <View>
              <Text style={styles.teamText}>
                {pickingTeam} - {formatTime(time)}
              </Text>
            </View>
            <View>
              <Text>
                Round {round} - Pick {pickNumber} {"(#"}
                {overall} Overall{")"}
              </Text>
            </View>
          </View>
          <View style={styles.inputsContainer}>
            {playerPosition !== "DST" && (
              <View style={styles.nameInputContainer}>
                <TextInput
                  placeholder="Name"
                  value={playerName}
                  onChangeText={setPlayerName}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            )}
            <View style={styles.teamContainer}>
              <SelectDropdown
                ref={teamDropdownRef}
                data={TEAMS}
                onSelect={setPlayerTeam}
                defaultButtonText="Team"
                search
                searchPlaceHolder="Search"
                buttonStyle={styles.nameInputContainer}
                buttonTextStyle={styles.input}
                defaultValue={""}
              />
            </View>
            <View style={styles.positionsContainer}>
              {POSITIONS.map((pos) => (
                <PositionButton
                  pos={pos}
                  key={pos}
                  selected={playerPosition === pos}
                  onPress={() => {
                    if (playerPosition === pos) {
                      setPlayerPosition("");
                    } else {
                      setPlayerPosition(pos);
                    }
                  }}
                />
              ))}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm"
              disabled={
                (playerName === "" && playerPosition !== "DST") ||
                playerTeam === "" ||
                playerPosition === ""
              }
              onPress={confirmDraftPick}
            />
            <Button
              title={clockRunning ? "Pause" : "Resume"}
              onPress={toggleClock}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pickData: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInputContainer: {
    padding: 5,
    margin: 5,
    width: "80%",
    borderWidth: 2,
    borderRadius: 5,
  },
  input: {
    fontSize: 24,
    padding: 5,
    textAlign: "center",
  },
  teamContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  positionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
  },
  buttonContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  teamText: {
    fontSize: 36,
  },
});

export default DraftScreen;
