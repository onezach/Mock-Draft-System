import { useEffect, useRef, useState } from "react";
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

const SERVER_URL = "http://192.168.1.189:5000";

const DraftScreen = () => {
  const [round, setRound] = useState(1);
  const [pickNumber, setPickNumber] = useState(1);
  const [overall, setOverall] = useState(1);
  const [pickingTeam, setPickingTeam] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState("");
  const teamDropdownRef = useRef({});
  const [playerPosition, setPlayerPosition] = useState("");

  const reset = () => {
    setPlayerName("");
    setPlayerTeam("");
    setPlayerPosition("");
    teamDropdownRef.current.reset();
  };

  const refresh = () => {
    fetch(SERVER_URL + "/client/update", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRound(data.pick.round);
        setPickNumber(data.pick.number);
        setOverall(data.pick.overall);
        setPickingTeam(data.team);
      })
      .catch(() => {});
  };

  const confirmDraftPick = () => {
    fetch(SERVER_URL + "/client/pick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerName,
        team: playerTeam,
        position: playerPosition,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        reset();
        refresh();
      });
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refresh();
    }, 2000);
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <View style={styles.pickData}>
            <View>
              <Text style={styles.teamText}>{pickingTeam}</Text>
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
    backgroundColor: "white",
  },
  pickData: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    // borderWidth: 1,
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInputContainer: {
    padding: 5,
    margin: 5,
    width: "80%",
    backgroundColor: "white",
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
