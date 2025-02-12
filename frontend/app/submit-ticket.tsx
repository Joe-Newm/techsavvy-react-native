import {
  View, Text, TextInput, Button, Pressable, Alert, Modal,
  StyleSheet, ActivityIndicator, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Platform, ScrollView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useLocalSearchParams } from "expo-router";
import { Dropdown } from 'react-native-element-dropdown'
import * as ImagePicker from "expo-image-picker"
import DatePicker from "react-native-date-picker"
import * as Permissions from 'expo-permissions';


export default function SubmitScreen() {
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [dropdownvalue, setdropdownValue] = useState(null);
  const [date, setDate] = useState(null)
  const [open, setOpen] = useState(false); // Controls modal visibility
  const [tempDate, setTempDate] = useState(new Date()); // Holds the temporary selected date

  useEffect(() => {
    // Check and request permissions on app start
    if (Platform.OS === 'ios') {
      requestIOSPermission();
    } else if (Platform.OS === 'android') {
      //requestAndroidPermission();
    }
  }, []);

  const requestIOSPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA); // Example for camera
      if (status !== 'granted') {
        console.log('Permission denied');
      } else {
        console.log('Permission granted');
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };


  // options for priority dropdown
  const options = [
    { value: 7, label: 'Low' },
    { value: 8, label: 'Medium' },
    { value: 15, label: 'High' },
  ];

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subject: '',
      message: '',
      email: '',
      image: '',
      dropdown: options[0].value,
      date: date,
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



  // delete selected photo 
  const deleteSelectedPhoto = () => {
    console.log("deleted")
    setImage(null);
    setValue("image", '');
  }

  // image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

    console.log(result);

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`
      setImage(base64Image);
      setValue("image", base64Image);
    }
  };


  // check the type of ticket 
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


  // submit form
  const onSubmit = async (data: any) => {
    setLoading(true);
    const url = 'http://192.168.1.68:3000/create-ticket';

    const boardCheck = checkCategory(type);

    const body = JSON.stringify({
      summary: data.subject,
      initialDescription: data.message,
      contactemailaddress: data.email,
      image: data.image,
      boardType: boardCheck,
      priorityCheck: data.dropdown,
      date: data.date,
    });
    console.log(data.date)

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
        Alert.alert("Success!", "Your ticket has been submitted successfully. Please give us some time to work on your issue.");
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

  function dismissKeyboard() { if (Platform.OS != "web") { Keyboard.dismiss(); } }

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>

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
            defaultValue={options[0].value} // Ensure there's a default value
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

          {
            Platform.OS === 'web' ?
              null : (
                <View style={{ alignItems: "flex-start", width: "90%", marginTop: 20 }}>
                  <Text style={styles.label}>What Time Are You Available?</Text>

                  {/* Button to Open Date Picker */}
                  <TouchableOpacity onPress={() => setOpen(true)} style={styles.dateButton}>
                    <Text style={styles.buttonLabel}>
                      {date
                        ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Select a Date"}
                    </Text>
                  </TouchableOpacity>

                  {/* Date Picker Modal */}
                  <Modal transparent={true} visible={open} animationType="fade">
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <DatePicker date={tempDate ?? new Date()}
                          onDateChange={setTempDate}
                          theme="light"
                        />

                        {/* Buttons to Confirm or Cancel */}
                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setOpen(false)
                              setDate(null);
                              setValue("date", null);
                            }
                            }
                            style={[styles.modalButton, { borderColor: "red" }]}
                          >
                            <Text style={styles.buttonLabel}>Cancel</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setDate(tempDate);
                              setValue("date", tempDate);
                              setOpen(false);
                            }}
                            style={[styles.modalButton, { borderColor: "green" }]}
                          >
                            <Text style={styles.buttonLabel}>Confirm</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              )
          }

          {/* Image Upload (Optional) */}
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: '600', textAlign: "center" }}>Attach Image (Optional)</Text>
          </TouchableOpacity>

          {
            image && (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
                <Pressable style={styles.XButton} onPress={deleteSelectedPhoto}>
                  <Text>X</Text>
                </Pressable>
              </View>

            )
          }

          {
            loading ? (
              <ActivityIndicator size="large" color="#ffa904" style={{ marginTop: 20 }} />
            ) : (
              <Pressable onPress={handleSubmit(onSubmit)} style={[styles.button, { marginBottom: 40 }]}>
                <Text style={styles.buttonLabel}>Submit</Text>
              </Pressable>
            )
          }
        </View >
      </TouchableWithoutFeedback >
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  textItem: {
    height: 40,
    fontSize: 20,
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 20,

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
  dateButton: {
    borderRadius: 10,
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  XButton: {
    borderRadius: 10,
    width: 50,
    height: 50,
    backgroundColor: '#ffa904',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
