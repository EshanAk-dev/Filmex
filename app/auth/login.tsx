import CustomSnackbar from "@/components/CustomSnackbar";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  const router = useRouter();
  const { setUser, setIsLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success" | "info",
  });

  const showSnackbar = (message: string, type: "error" | "success" | "info" = "error") => {
    setSnackbar({
      visible: true,
      message,
      type,
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      await signIn(form.email, form.password);
      const { getCurrentUser } = await import("@/services/auth");
      const result = await getCurrentUser();

      if (result) {
        setUser(result);
        showSnackbar("Login successful!", "success");
        // Small delay to show success message before navigation
        setTimeout(() => {
          router.replace("/(tabs)/profile");
        }, 1000);
      }
    } catch (error: any) {
      showSnackbar(error.message || "Login failed", "error");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View className="items-center mb-12">
              <Text className="text-5xl font-bold text-white mb-6">
                FILMEX
              </Text>
              <Text className="text-4xl font-bold text-white mb-2">
                Welcome Back
              </Text>
              <Text className="text-light-300 text-base text-center">
                Sign in to continue your movie journey
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-6">
              {/* Email Input */}
              <View>
                <Text className="text-light-200 text-sm font-medium mb-2">
                  Email Address
                </Text>
                <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-2 mb-2 flex-row items-center">
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color="#AB8BFF"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="text-white text-base mt-1 flex-1"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA4AB"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-light-200 text-sm font-medium mb-2">
                  Password
                </Text>
                <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-1.5 mb-2 flex-row items-center">
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#AB8BFF"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="text-white text-base mt-2 flex-1"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA4AB"
                    value={form.password}
                    onChangeText={(text) =>
                      setForm({ ...form, password: text })
                    }
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Login Button */}
              <Pressable
                className={`bg-accent rounded-xl py-4 items-center mt-8 ${
                  isSubmitting ? "opacity-50" : ""
                }`}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">
                      Signing In...
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons
                      name="log-in-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 5 }}
                    />
                    <Text className="text-white text-base font-semibold">
                      Sign In
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-light-300/20" />
                <Text className="text-light-300 text-sm mx-4">or</Text>
                <View className="flex-1 h-px bg-light-300/20" />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-light-300 text-base">
                  Don't have an account?{" "}
                </Text>
                <Pressable onPress={() => router.push("/auth/register")}>
                  <Text className="text-accent text-base font-semibold">
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Custom Snackbar */}
        <CustomSnackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onHide={hideSnackbar}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Login;