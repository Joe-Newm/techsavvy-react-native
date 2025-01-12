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
      <Link href="/about" style={styles.button}>
        Go to about screen! Please.
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  }
})
