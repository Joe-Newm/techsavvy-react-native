import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

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
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  }
})
