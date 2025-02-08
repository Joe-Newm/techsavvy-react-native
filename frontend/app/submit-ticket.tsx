import {
  View, Text, TextInput, Button, Pressable,
  StyleSheet, ActivityIndicator, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useLocalSearchParams } from "expo-router";
import { Dropdown } from 'react-native-element-dropdown'

export default function SubmitScreen() {
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [dropdownvalue, setdropdownValue] = useState(null);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subject: '',
      message: '',
      email: '',
      image: '',
      drodown: '',// Ensure an empty value for optional image
    }
  });

  // for dropdown menu
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    launchImageLibrary(options, (response: any) => {
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

  const checkCategory = (ticketType: any) => {
    if (ticketType == "support") {
      return {
        id: 1,
        name: "Help Desk"
      }
    } else {
      return {
        id: 25,
        name: "Chromebook Repair"
      }
    }
  }

  const options = [
    { value: 7, label: 'Low' },
    { value: 8, label: 'Medium' },
    { value: 15, label: 'High' },
  ];

  console.log(type);
  const onSubmit = async (data: any) => {
    setLoading(true);
    const url = 'http://localhost:3000/create-ticket';

    const boardCheck = checkCategory(type);

    const body = JSON.stringify({
      summary: data.subject,
      initialDescription: data.message,
      contactemailaddress: data.email,
      image: data.image,  // Include optional image
      boardType: boardCheck,
      priorityCheck: data.dropdown,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

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

        <View style={{ alignItems: "flex-start", width: "90%" }}>
          <Text style={[styles.label, { textAlign: 'left' }]}>Priority</Text>
        </View>

        <Controller
          control={control}
          name="dropdown"
          defaultValue={options[0].label} // Ensure there's a default value
          render={({ field: { onChange, value } }) => (
            <Dropdown
              style={styles.dropdown}
              data={options}
              labelField="label"
              valueField="value"
              placeholder="Select an option"
              value={value} // Controlled value
              renderItem={renderItem}
              renderTouchableComponent={TouchableOpacity}
              onChange={(item) => {
                setdropdownValue(item.value); // Update local state
                onChange(item.value); // Update react-hook-form
              }}
            />
          )}
        />
        {/* Image Upload (Optional) */}
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={{ color: "black", fontSize: 20, fontWeight: '600', textAlign: "center" }}>Attach Image (Optional)</Text>
        </TouchableOpacity>

        {
          image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )
        }

        {
          loading ? (
            <ActivityIndicator size="large" color="#ffa904" style={{ marginTop: 20 }} />
          ) : (
            <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
              <Text style={styles.buttonLabel}>Submit</Text>
            </Pressable>
          )
        }
      </View >
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  textItem: {
    height: 40,
    fontSize: 20,
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    width: "90%",
    height: 60,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    fontSize: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    fontSize: 24,
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
    marginTop: 40,
  },
});
