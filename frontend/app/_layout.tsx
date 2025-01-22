import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ title: 'Home', headerShown: false }} />
    <Stack.Screen name="+not-found" />
    <Stack.Screen name="submit-ticket" />
  </Stack>
}
