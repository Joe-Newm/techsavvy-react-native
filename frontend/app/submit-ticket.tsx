import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';


export default function SubmitScreen() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      subject: '',  // Ensure empty string instead of undefined
      message: '',
      email: '',
    }
  });

  const onSubmit = async (data: any) => {
    const url = 'http://localhost:3000/create-ticket';

    const body = JSON.stringify({
      summary: data.subject,
      initialDescription: data.message,
      contactemailaddress: data.email,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body,
      })
      if (response.ok) {
        console.log("submited!")
        alert("Your ticket has been submitted successfully. Please give us some time to work on your issue.")

      } else {
        console.log("frontend failed to send.", await response.text());
        alert("Error. message failed to send. Make sure you filled out every form field.")
      }
    } catch (error) {
      console.log("error sending ticket to backend", error);
      alert("Ticket failed to send. Please call us.")
    }

  };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Submit a ticket</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.form}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Subject"
            placeholderTextColor="#888"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.form}
          />
        )}
        name="subject"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Message"
            placeholderTextColor="#888"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.form}
          />
        )}
        name="message"
      />
      <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonLabel}>Submit</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },

  text: {
    fontSize: 40,
    fontWeight: 700,
    marginBottom: 20,
  },
  buttonLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 600,
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
  form: {
    backgroundColor: '#E0E0E0',
    width: '90%',
    height: 60,
    color: 'black',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    marginBottom: 20,

  }
}
)
