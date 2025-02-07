import {
  View, Text, TextInput, Button, Pressable,
  StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useRouter } from "expo-router";

export default function CategoryScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>What Type of Ticket are You Submitting?</Text>
        <Pressable style={styles.button} onPress={() => router.push('/submit-ticket?type=support')}>
          <Text style={styles.buttonLabel}>Support Ticket</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/submit-ticket?type=chromebook')}>
          <Text style={styles.buttonLabel}>Chromebook Repair Ticket</Text>
        </Pressable>
      </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({

  text: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 20,
  }
})
