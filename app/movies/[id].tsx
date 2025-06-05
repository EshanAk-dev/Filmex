// Updated [id].tsx with save functionality
import placeholderImage from "@/assets/images/placeholder.png";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useAuth } from "@/context/AuthContext";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Interface for movie info component
interface MovieInfoProps {
  label: string;
  value?: string | number | null;
  icon?: keyof typeof Ionicons.glyphMap;
}

// Info card component
const InfoCard = ({ label, value, icon }: MovieInfoProps) => (
  <View className="bg-dark-100/50 rounded-xl p-4 mb-3 border border-dark-100">
    <View className="flex-row items-center mb-2">
      {icon && (
        <Ionicons name={icon} size={16} color="#AB8BFF" className="mr-2" />
      )}
      <Text className="text-accent text-sm font-semibold uppercase tracking-wide">
        {label}
      </Text>
    </View>
    <Text className="text-white text-base leading-6">{value || "N/A"}</Text>
  </View>
);

// Statistics card component
const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) => (
  <View className="bg-dark-100/50 rounded-xl p-4 flex-1 border border-dark-100">
    <Text className="text-accent text-xs font-semibold uppercase tracking-wide mb-1">
      {title}
    </Text>
    <Text className="text-white text-lg font-bold">{value}</Text>
    {subtitle && (
      <Text className="text-light-300 text-xs mt-1">{subtitle}</Text>
    )}
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const [scrollY] = useState(new Animated.Value(0));
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { isLoggedIn } = useAuth();
  const { saveMovieHandler, removeSavedMovieHandler, isMovieSavedHandler } =
    useSavedMovies();

  const [isSaving, setIsSaving] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const showSnackbar = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setSnackbar({ visible: true, message, type });
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: "clamp",
  });

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  // Handle saving/removing movie from collection
  const handleSaveMovie = async () => {
    if (!isLoggedIn) {
      showSnackbar("Please log in to save movies to your collection.", "error");
      return;
    }

    if (!movie) return;

    setIsSaving(true);
    try {
      const movieIsSaved = isMovieSavedHandler(movie.id);

      if (movieIsSaved) {
        await removeSavedMovieHandler(movie.id);
        showSnackbar("Movie removed from your saved collection!", "success");
      } else {
        await saveMovieHandler(movie);
        showSnackbar("Movie saved to your collection!", "success");
      }
    } catch (error: any) {
      if (error.message === "Movie is already saved") {
        showSnackbar("This movie is already in your saved collection!", "info");
      } else {
        showSnackbar("Failed to save movie. Please try again.", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
        <Text className="text-light-300 mt-4 text-base">
          Loading movie details...
        </Text>
      </View>
    );
  }

  const movieIsSaved = movie ? isMovieSavedHandler(movie.id) : false;

  return (
    <View className="bg-primary flex-1">
      {/* Snackbar */}
      <CustomSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
      {/* Header */}
      <Animated.View
        style={{ opacity: headerOpacity }}
        className="absolute top-0 left-0 right-0 z-20 bg-primary/95 pt-12 pb-4 px-5 border-b border-dark-100"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={router.back}
            className="bg-dark-100/80 rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text
            className="text-white font-bold text-lg flex-1 ml-4"
            numberOfLines={1}
          >
            {movie?.title}
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Poster */}
        <View className="relative">
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            <Image
              source={
                movie?.poster_path
                  ? {
                      uri: `https://image.tmdb.org/t/p/original${movie?.poster_path}`,
                    }
                  : placeholderImage
              }
              className="w-full h-[600px]"
              resizeMode="cover"
            />
          </Animated.View>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(3, 0, 20, 0.8)", "#030014"]}
            className="absolute bottom-0 left-0 right-0 h-40"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={router.back}
            className="absolute top-12 left-5 bg-black/50 rounded-full p-3"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Save/Bookmark Button */}
          <TouchableOpacity
            onPress={handleSaveMovie}
            disabled={isSaving}
            className="absolute top-12 right-5 bg-black/50 rounded-full p-3"
          >
            {isSaving ? (
              <ActivityIndicator size={20} color="white" />
            ) : (
              <Ionicons
                name={movieIsSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={movieIsSaved ? "#AB8BFF" : "white"}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Movie Info Section */}
        <View className="px-5 -mt-20 relative z-10">
          {/* Title and Basic Info */}
          <View className="mb-6">
            <Text className="text-white font-bold text-3xl mb-3 leading-tight">
              {movie?.title}
            </Text>

            {/* Meta Info Row */}
            <View className="flex-row items-center flex-wrap gap-4 mb-4">
              <View className="flex-row items-center bg-dark-100/50 rounded-full px-3 py-1">
                <Ionicons name="calendar-outline" size={14} color="#9CA4AB" />
                <Text className="text-light-300 text-sm ml-1">
                  {movie?.release_date?.split("-")[0]}
                </Text>
              </View>

              <View className="flex-row items-center bg-dark-100/50 rounded-full px-3 py-1">
                <Ionicons name="time-outline" size={14} color="#9CA4AB" />
                <Text className="text-light-300 text-sm ml-1">
                  {movie?.runtime}min
                </Text>
              </View>

              <View className="flex-row items-center bg-accent/20 rounded-full px-3 py-1">
                <Ionicons name="star" size={14} color="#AB8BFF" />
                <Text className="text-accent font-bold text-sm ml-1">
                  {movie?.vote_average?.toFixed(1)}/10
                </Text>
              </View>
            </View>

            {/* Genres */}
            <View className="flex-row flex-wrap gap-2">
              {movie?.genres?.map((genre, index) => (
                <View
                  key={index}
                  className="bg-accent/10 border border-accent/30 rounded-full px-3 py-1"
                >
                  <Text className="text-accent text-xs font-medium">
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Rating and Stats */}
          <View className="flex-row gap-3 mb-6">
            <StatCard
              title="Rating"
              value={`${movie?.vote_average?.toFixed(1)}/10`}
              subtitle={`${movie?.vote_count} votes`}
            />
            <StatCard
              title="Budget"
              value={movie?.budget ? formatBudget(movie.budget) : "N/A"}
            />
            <StatCard
              title="Revenue"
              value={movie?.revenue ? formatBudget(movie.revenue) : "N/A"}
            />
          </View>

          {/* Overview */}
          <InfoCard
            label="Overview"
            value={movie?.overview}
            icon="document-text-outline"
          />

          {/* Production Companies */}
          {movie?.production_companies &&
            movie.production_companies.length > 0 && (
              <InfoCard
                label="Production Companies"
                value={movie.production_companies
                  .map((c) => c.name)
                  .join(" • ")}
                icon="business-outline"
              />
            )}

          {/* Additional Info */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <InfoCard
                label="Language"
                value={movie?.original_language?.toUpperCase()}
                icon="language-outline"
              />
            </View>
            <View className="flex-1">
              <InfoCard
                label="Status"
                value={movie?.status}
                icon="checkmark-circle-outline"
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-5 left-5 right-5 flex-row gap-3">
        <TouchableOpacity className="flex-1 bg-accent rounded-xl py-4 flex-row items-center justify-center shadow-lg">
          <Ionicons name="play" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Watch Trailer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveMovie}
          disabled={isSaving}
          className={`rounded-xl py-4 px-6 flex-row items-center justify-center border ${
            movieIsSaved
              ? "bg-accent/20 border-accent"
              : "bg-dark-100 border-accent/30"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size={20} color="#AB8BFF" />
          ) : (
            <Ionicons
              name={movieIsSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#AB8BFF"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetails;
