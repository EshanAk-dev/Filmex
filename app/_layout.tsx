import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Hide group headers */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
