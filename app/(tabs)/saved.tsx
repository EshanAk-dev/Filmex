import SavedMovieCard from "@/components/SavedMovieCard";
import { useAuth } from "@/context/AuthContext";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Saved = () => {
  const { isLoggedIn } = useAuth();
  const {
    savedMovies,
    isLoading,
    removeSavedMovieHandler,
    refreshSavedMovies,
  } = useSavedMovies();

  const handleRemoveMovie = async (movieId: number) => {
    try {
      await removeSavedMovieHandler(movieId);
    } catch (error) {
      console.log("Error removing movie:", error);
    }
  };

  // Group movies into groups of 3 for 3 columns
  const groupMoviesInThrees = (movies: any[]) => {
    const groups = [];
    for (let i = 0; i < movies.length; i += 3) {
      groups.push(movies.slice(i, i + 3));
    }
    return groups;
  };

  if (!isLoggedIn) {
    return (
      <View className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Ionicons name="person-outline" size={64} color="#9CA4AB" />
          <Text className="text-gray-500 text-base text-center">
            Please log in to view your saved movies
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            className="bg-accent rounded-xl px-6 py-3"
          >
            <Text className="text-white font-semibold">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="bg-primary flex-1">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className="text-gray-500 text-base">
            Loading saved movies...
          </Text>
        </View>
      </View>
    );
  }

  if (savedMovies.length === 0) {
    return (
      <View className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Ionicons name="bookmark-outline" size={64} color="#9CA4AB" />
          <Text className="text-gray-500 text-base text-center">
            No saved movies yet
          </Text>
          <Text className="text-gray-400 text-sm text-center">
            Start exploring and save your favorite movies!
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="bg-accent rounded-xl px-6 py-3"
          >
            <Text className="text-white font-semibold">Explore Movies</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const movieGroups = groupMoviesInThrees(savedMovies);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="pt-16 pb-6 px-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl text-white font-bold">
                Saved Movies
              </Text>
              <Text className="text-light-300 text-sm">
                {savedMovies.length} movie{savedMovies.length !== 1 ? "s" : ""}{" "}
                saved
              </Text>
            </View>
            <TouchableOpacity
              onPress={refreshSavedMovies}
              className="bg-dark-100/50 rounded-full p-2"
            >
              <Ionicons name="refresh-outline" size={20} color="#AB8BFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Movies List */}
        <FlatList
          data={movieGroups}
          renderItem={({ item: group }) => (
            <View className="flex-row px-4">
              <SavedMovieCard movie={group[0]} onRemove={handleRemoveMovie} />
              {group[1] && (
                <SavedMovieCard movie={group[1]} onRemove={handleRemoveMovie} />
              )}
              {group[2] && (
                <SavedMovieCard movie={group[2]} onRemove={handleRemoveMovie} />
              )}

              {!group[1] && <View className="flex-1 mx-1" />}
              {!group[2] && <View className="flex-1 mx-1" />}
            </View>
          )}
          keyExtractor={(item, index) => `group-${index}`}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </View>
  );
};

export default Saved;
