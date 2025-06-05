import { AuthProvider } from "@/context/AuthContext";
import { SavedMoviesProvider } from "@/context/SavedMoviesContext";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedMoviesProvider>
        <Stack>
          {/* Hide group headers */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        </Stack>
      </SavedMoviesProvider>
    </AuthProvider>
  );
}
