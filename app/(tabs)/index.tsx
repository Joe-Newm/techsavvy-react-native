import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.text}>
        Welcome to the Techsavvy app!
      </Text>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}> Call </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: 700,
  },
  button: {
    borderRadius: 10,
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 20,
  },
})
