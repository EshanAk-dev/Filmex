import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: "error" | "success" | "info";
  duration?: number;
  onHide: () => void;
}

const { width } = Dimensions.get("window");

const CustomSnackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  type = "error",
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show snackbar
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100, // Slide up to hide
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4ECDC4";
      case "error":
        return "#FF6B6B";
      case "info":
        return "#AB8BFF";
      default:
        return "#FF6B6B";
    }
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "info":
        return "information-circle";
      default:
        return "alert-circle";
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        transform: [{ translateY }],
        opacity,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Ionicons
          name={getIconName() as any}
          size={20}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "500",
            flex: 1,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default CustomSnackbar;
