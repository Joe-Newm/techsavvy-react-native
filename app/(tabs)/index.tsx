import { Text, View, StyleSheet, Pressable, Linking, Image } from "react-native";
import { Link } from "expo-router";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useRouter } from "expo-router";
import SvgUri from 'react-native-svg';

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
      {/*
      <Text style={styles.text}>
        Welcome to the Techsavvy app!
      </Text>
      */}

      {/*<SvgUri uri={require('../../assets/images/full-logo.svg')} width="200" height="200" /> */}

      <Image
        source={require('../../assets/images/full-logo.png')} // Adjust the path accordingly
        style={styles.image}
        resizeMode="contain" // This keeps the aspect ratio
      />
      <Pressable
        style={styles.button}
        onPress={() => router.push('/submit-ticket')} // Navigate on press
      >
        <Text style={styles.buttonLabel}> Submit a Ticket </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => Linking.openURL('tel:3188840844').catch((err) => console.error('Failed to open phone dialer', err))}>
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
  image: {
    height: 300,
    width: 300,
  }
})
