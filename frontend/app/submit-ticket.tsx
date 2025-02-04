import {
  View, Text, TextInput, Button, Pressable,
  StyleSheet, ActivityIndicator, TouchableOpacity, Image
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";

export default function SubmitScreen() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // Move image state here
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subject: '',
      message: '',
      email: '',
      image: '',  // Ensure an empty value for optional image
    }
  });

  const pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("Error: ", response.errorMessage);
      } else {
        const imageUri = response.assets[0].uri;
        setImage(imageUri);
        setValue("image", imageUri); // Store image in form
      }
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const url = 'http://localhost:3000/create-ticket';

    const body = JSON.stringify({
      summary: data.subject,
      initialDescription: data.message,
      contactemailaddress: data.email,
      image: data.image,  // Include optional image
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body,
      });

      if (response.ok) {
        console.log("Submitted!");
        alert("Your ticket has been submitted successfully. Please give us some time to work on your issue.");
      } else {
        console.log("Frontend failed to send.", await response.text());
        alert("Error: Message failed to send. Make sure you filled out every form field.");
      }
    } catch (error) {
      console.log("Error sending ticket to backend", error);
      alert("Ticket failed to send. Please call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Submit a Ticket</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
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
      />

      <Controller
        control={control}
        name="subject"
        rules={{ required: "Subject is required" }}
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
      />

      <Controller
        control={control}
        name="message"
        rules={{ required: "Message is required" }}
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
      />

      {/* Image Upload (Optional) */}
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={{ color: "black", fontSize: 20, fontWeight: '600', textAlign: "center" }}>Attach Image (Optional)</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#ffa904" style={{ marginTop: 20 }} />
      ) : (
        <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 20,
  },
  buttonLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: "600",
  },
  button: {
    borderRadius: 10,
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffa904',
    marginBottom: 20,
    marginTop: 20,
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
    fontSize: 20,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#ffa904",
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
});
