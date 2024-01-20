import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TextInput,
  Text,
} from "react-native";
import { useState } from "react";
const InitializationScreen = (props) => {
  const [numTeams, setNumTeams] = useState("");
  const [numRounds, setNumRounds] = useState("");
  const [timePerPick, setTimePerPick] = useState("");

  const sendDraftInfo = () => {
    const teams = parseInt(numTeams);
    const rounds = parseInt(numRounds);
    const time = parseInt(timePerPick);

    if (
      teams > 0 &&
      teams <= 32 &&
      rounds > 0 &&
      rounds <= 40 &&
      timePerPick >= 15 &&
      timePerPick <= 600
    ) {
      fetch(props.serverURL + "/draft/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numTeams: teams,
          numRounds: rounds,
          timePerPick: time,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          props.startDraft(r.draft_code);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 36 }}>Draft Initialization</Text>
        </View>
        <View style={styles.inputsContainer}>
        <Text># Teams</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="12"
              value={numTeams}
              inputMode="numeric"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setNumTeams}
            />
          </View>
          <Text># Rounds</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="15"
              value={numRounds}
              inputMode="numeric"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={setNumRounds}
            />
          </View>
          <Text>Time Per Pick (seconds)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="90"
              value={timePerPick}
              inputMode="numeric"
              keyboardType="numeric"
              maxLength={3}
              onChangeText={setTimePerPick}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Start"
            disabled={
              isNaN(parseInt(numTeams)) ||
              isNaN(parseInt(numRounds)) ||
              isNaN(parseInt(timePerPick))
            }
            onPress={sendDraftInfo}
          />
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
  titleContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    padding: 5,
    margin: 5,
    width: 80,   
    borderWidth: 2,
    borderRadius: 5,
  },
  input: {
    fontSize: 24,
    padding: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InitializationScreen;
