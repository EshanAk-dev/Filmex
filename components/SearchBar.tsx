import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface Props {
  placeholder: string;
  value?: string; // In this ? make these optional
  onPress?: () => void;
  onChangeText?: (text: string) => void;
} // Tells whats are the types of props

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-100 rounded-full px-5 py-1.5">
      <Ionicons name="search" size={23} color="#AB8BFF" />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#ab85db"
        style={styles.input}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#fff",
  },
});
