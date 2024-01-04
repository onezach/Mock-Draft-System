import { Pressable, View, StyleSheet, Text } from "react-native";

const PositionButton = (props) => {
  return (
    <Pressable onPress={props.onPress}>
      <View style={[styles.button, props.selected ? styles.buttonOn : ""]}>
        <Text style={[styles.text, props.selected ? styles.textOn : ""]}>
          {props.pos}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 12.5,
    width: 50,
    height: 35,
    margin: 5,
  },
  buttonOn: {
    backgroundColor: "black",
  },
  text: {
    textAlign: "center",
    fontSize: 18,
  },
  textOn: {
    color: "white",
  },
});

export default PositionButton;
