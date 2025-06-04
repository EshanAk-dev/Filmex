import CustomSnackbar from "@/components/CustomSnackbar";
import { useAuth } from "@/context/AuthContext";
import { createUser } from "@/services/auth";
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
  View
} from "react-native";

const Register = () => {
  const router = useRouter();
  const { setUser, setIsLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      showSnackbar("Please fill in all fields", "error");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return false;
    }

    if (form.password.length < 8) {
      showSnackbar("Password must be at least 8 characters long", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showSnackbar("Please enter a valid email address", "error");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const result = await createUser(form.email, form.password, form.name);

      if (result) {
        setUser(result);
        showSnackbar("Account created successfully!", "success");
        setTimeout(() => {
          router.replace("/(tabs)/profile");
        }, 1000);
      }
    } catch (error: any) {
      showSnackbar(error.message || "Registration Failed", "error");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#0F0D23', '#1A0E2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 justify-center py-8">
            {/* Header */}
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-white mb-2">
                Join FILMEX
              </Text>
              <Text className="text-light-300 text-base text-center">
                Create your account to discover amazing movies
              </Text>
            </View>

            {/* Register Form */}
            <View className="space-y-5">
              {/* Name Input */}
              <View>
                <Text className="text-light-200 text-sm font-medium mb-2">
                  Full Name
                </Text>
                <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-2 mb-2 flex-row items-center">
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#AB8BFF"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="text-white text-base mt-1 flex-1"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA4AB"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-1.5 flex-row items-center">
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
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
                <Text className="text-light-300/70 text-xs mt-1 mb-2">
                  Must be at least 8 characters long
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text className="text-light-200 text-sm font-medium mb-2">
                  Confirm Password
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
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA4AB"
                    value={form.confirmPassword}
                    onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Register Button */}
              <Pressable
                className={`bg-accent rounded-xl py-4 items-center mt-8 ${
                  isSubmitting ? "opacity-50" : ""
                }`}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">
                      Creating Account...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Create Account
                  </Text>
                )}
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-light-300/20" />
                <Text className="text-light-300 text-sm mx-4">or</Text>
                <View className="flex-1 h-px bg-light-300/20" />
              </View>

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-light-300 text-base">
                  Already have an account?{" "}
                </Text>
                <Pressable onPress={() => router.push("/auth/login")}>
                  <Text className="text-accent text-base font-semibold">
                    Sign In
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

export default Register;