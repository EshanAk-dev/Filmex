import { useAuth } from "@/context/AuthContext";
import { signOut, updatePassword, updateProfile } from "@/services/auth";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const Profile = () => {
  const router = useRouter();
  const { user, setUser, isLoggedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            setUser(null);
            router.replace("/auth/login");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(profileForm.name);
      setUser({ ...user, name: updatedUser.name } as any);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(passwordForm.newPassword, passwordForm.oldPassword);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      Alert.alert("Success", "Password updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={["#0F0D23", "#1A0E2E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <View className="flex-1 justify-center items-center px-6">
            <Feather name="user" size={80} color="#AB8BFF" />
            <Text className="text-white text-2xl font-bold mt-6 mb-4">
              Welcome to FILMEX
            </Text>
            <Text className="text-light-300 text-center text-base mb-8">
              Sign in to access your profile and personalized movie
              recommendations
            </Text>

            <Pressable
              className="bg-accent rounded-xl py-4 px-8 mb-4 w-3/4"
              onPress={() => router.push("/auth/login")}
            >
              <Text className="text-white text-base font-semibold text-center">
                Sign In
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/register")}>
              <Text className="text-accent text-base font-semibold">
                Create Account
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 50, paddingBottom: 110 }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-accent/20 rounded-full p-6 mb-4">
              <Feather name="user" size={60} color="#AB8BFF" />
            </View>
            <Text className="text-white text-2xl font-bold">{user?.name}</Text>
            <Text className="text-light-300 text-base">{user?.email}</Text>
          </View>

          {/* Profile Section */}
          <View className="bg-dark-100/50 border border-light-300/20 rounded-2xl p-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">
                Profile Information
              </Text>
              <Pressable
                onPress={() => {
                  setIsEditing(!isEditing);
                  setProfileForm({ name: user?.name || "" });
                }}
              >
                <Feather
                  name={isEditing ? "x" : "edit-2"}
                  size={20}
                  color="#AB8BFF"
                />
              </Pressable>
            </View>

            {isEditing ? (
              <View className="space-y-4">
                <View>
                  <Text className="text-light-200 text-sm font-medium mb-2">
                    Full Name
                  </Text>
                  <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-3">
                    <TextInput
                      className="text-white text-base"
                      value={profileForm.name}
                      onChangeText={(text) => setProfileForm({ name: text })}
                      placeholder="Enter your name"
                      placeholderTextColor="#9CA4AB"
                    />
                  </View>
                </View>
                <View className="flex-row mt-4">
                  <View className="flex-1 mr-2">
                    <Pressable
                      className="bg-accent rounded-xl py-3 items-center"
                      onPress={handleUpdateProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white font-semibold">Save</Text>
                      )}
                    </Pressable>
                  </View>
                  <View className="flex-1 ml-2">
                    <Pressable
                      className="bg-light-300/20 rounded-xl py-3 items-center"
                      onPress={() => setIsEditing(false)}
                    >
                      <Text className="text-light-300 font-semibold">
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text className="text-light-300 text-sm">Name</Text>
                <Text className="text-white text-base font-medium mt-1">
                  {user?.name}
                </Text>
                <Text className="text-light-300 text-sm mt-3">Email</Text>
                <Text className="text-white text-base font-medium mt-1">
                  {user?.email}
                </Text>
              </View>
            )}
          </View>

          {/* Security Section */}
          <View className="bg-dark-100/50 border border-light-300/20 rounded-2xl p-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">Security</Text>
              <Pressable
                onPress={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                <Feather
                  name={isChangingPassword ? "x" : "lock"}
                  size={20}
                  color="#AB8BFF"
                />
              </Pressable>
            </View>

            {isChangingPassword ? (
              <View className="space-y-4">
                <View>
                  <Text className="text-light-200 text-sm font-medium mb-2">
                    Current Password
                  </Text>
                  <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-3 mb-2">
                    <TextInput
                      className="text-white text-base"
                      value={passwordForm.oldPassword}
                      onChangeText={(text) =>
                        setPasswordForm({ ...passwordForm, oldPassword: text })
                      }
                      placeholder="Enter current password"
                      placeholderTextColor="#9CA4AB"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-light-200 text-sm font-medium mb-2">
                    New Password
                  </Text>
                  <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-3 mb-2">
                    <TextInput
                      className="text-white text-base"
                      value={passwordForm.newPassword}
                      onChangeText={(text) =>
                        setPasswordForm({ ...passwordForm, newPassword: text })
                      }
                      placeholder="Enter new password"
                      placeholderTextColor="#9CA4AB"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-light-200 text-sm font-medium mb-2">
                    Confirm New Password
                  </Text>
                  <View className="bg-dark-100 border border-light-300/20 rounded-xl px-4 py-3 mb-2">
                    <TextInput
                      className="text-white text-base"
                      value={passwordForm.confirmPassword}
                      onChangeText={(text) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: text,
                        })
                      }
                      placeholder="Confirm new password"
                      placeholderTextColor="#9CA4AB"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View className="flex-row mt-4">
                  <View className="flex-1 mr-2">
                    <Pressable
                      className="bg-accent rounded-xl py-3 items-center"
                      onPress={handleUpdatePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white font-semibold">
                          Update Password
                        </Text>
                      )}
                    </Pressable>
                  </View>
                  <View className="flex-1 ml-2">
                    <Pressable
                      className="bg-light-300/20 rounded-xl py-3 items-center"
                      onPress={() => setIsChangingPassword(false)}
                    >
                      <Text className="text-light-300 font-semibold">Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text className="text-light-300 text-sm">Password</Text>
                <Text className="text-white text-base font-medium mt-1">
                  ••••••••••••
                </Text>
                <Text className="text-light-300/70 text-xs mt-1">
                  Update your password by tapping lock icon
                </Text>
              </View>
            )}
          </View>

          {/* Account Actions */}
          <View className="bg-dark-100/50 border border-light-300/20 rounded-2xl p-6">
            <Text className="text-white text-lg font-semibold mb-4">
              Account Actions
            </Text>

            <Pressable
              className="bg-red-500/20 border border-red-500/30 rounded-xl py-4 items-center"
              onPress={handleSignOut}
            >
              <View className="flex-row items-center">
                <Feather name="log-out" size={18} color="#EF4444" />
                <Text className="text-red-500 font-semibold ml-2">
                  Sign Out
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Profile;
