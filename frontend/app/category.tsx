import {
  View, Text, TextInput, Button, Pressable,
  StyleSheet, ActivityIndicator, TouchableOpacity, Image
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useRouter } from "expo-router";

export default function CategoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>What Type of Ticket do You Want To Submit?</Text>
      <Pressable style={styles.button} onPress={() => router.push('/submit-ticket')}>
        <Text style={styles.buttonLabel}>hi</Text>
      </Pressable>
    </View>

  )
}

const styles = StyleSheet.create({

  text: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: "600",
  },

  button: {
    height: 120,
    width: '90%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
