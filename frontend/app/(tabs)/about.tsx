import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>TechSavvy, LLC</Text>
      <Pressable style={styles.button} onPress={() => Linking.openURL('https://techsavvy.llc/').catch((err) => console.error('Failed to open phone dialer', err))}>
              <Text style={styles.buttonLabel}> Website </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => Linking.openURL('https://maps.google.com/maps?cid=9662179527694298765').catch((err) => console.error('Failed to open phone dialer', err))}>
              <Text style={styles.buttonLabel}> Directions </Text>
      </Pressable>
      <View style={{marginTop: 20, flex: 1, flexDirection: 'row', gap: 20}}>
        <Text style={styles.body}><Text style={{ fontWeight: 700}}>Address: </Text></Text>   <Text style={styles.body}>112 Professional Drive, West Monroe, LA 71291</Text>
      </View>
      <View style={{marginTop: 20, flex: 1, flexDirection: 'row', gap: 20, alignItems: 'flex-start', width: '100%'}}>
        <Text style={styles.body}><Text style={{ fontWeight: 700}}>Hours: </Text></Text>   
        <View style={{alignItems: 'flex-start'}}>
          <Text style={styles.body}>Monday - Friday</Text>
          <Text style={styles.body}>8am - 5pm</Text>
        </View>
      </View>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },

  text: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  body: {
    fontSize: 20,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffa904',
    marginTop: 20,
  },
  buttonLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: "600",
  },
}
)
