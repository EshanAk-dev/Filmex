import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const SavedMovieCard = ({
  movie,
  onRemove,
}: {
  movie: any;
  onRemove: (movieId: number) => void;
}) => {
  const formatSavedTime = (savedAt: string) => {
    const date = new Date(savedAt);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movies/${movie.movieId}`)}
      className="bg-dark-100/50 rounded-xl border border-dark-100 overflow-hidden flex-1 mx-1 mb-4"
    >
      {/* Movie Poster with Remove Button */}
      <View className="relative">
        <Image
          source={
            movie.posterPath
              ? { uri: `https://image.tmdb.org/t/p/w300${movie.posterPath}` }
              : images.placeholderImage
          }
          className="w-full h-40 rounded-t-xl"
          resizeMode="cover"
        />

        {/* Remove Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onRemove(movie.movieId);
          }}
          className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5"
        >
          <Ionicons name="trash-outline" size={12} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View className="p-2">
        <Text className="text-white font-bold text-xs mb-1.5" numberOfLines={1}>
          {movie.title}
        </Text>

        {/* Release Date and Vote Average */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={8} color="#9CA4AB" />
            <Text className="text-light-300 text-xs ml-1">
              {movie.releaseDate?.split("-")[0]}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="star" size={8} color="#AB8BFF" />
            <Text className="text-accent text-xs ml-1">
              {movie.voteAverage?.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Saved Time */}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={8} color="#9CA4AB" />
          <Text className="text-light-300 text-xs ml-1">
            {formatSavedTime(movie.savedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavedMovieCard;
