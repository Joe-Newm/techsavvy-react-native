import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
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
      <Pressable
        style={styles.button}
        onPress={() => router.push('/submit-ticket')} // Navigate on press
      >
        <Text style={styles.buttonLabel}> Submit a Ticket </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => alert("I haven't set up call functionality yet :(")}>
        <Text style={styles.buttonLabel}> Call </Text>
      </Pressable>
    </View >
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: 700,
  },
  button: {
    display: 'flex',
    borderRadius: 10,
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#ffa904',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 600,
  },
})
