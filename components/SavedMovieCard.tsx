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
}) => (
  <TouchableOpacity
    onPress={() => router.push(`/movies/${movie.movieId}`)}
    className="bg-dark-100/50 rounded-xl mb-4 border border-dark-100 overflow-hidden"
  >
    <View className="flex-row">
      {/* Movie Poster */}
      <Image
        source={
          movie.posterPath
            ? { uri: `https://image.tmdb.org/t/p/w200${movie.posterPath}` }
            : images.placeholderImage
        }
        className="w-24 h-30 rounded-lg"
        resizeMode="cover"
      />

      {/* Movie Info */}
      <View className="flex-1 p-4">
        <Text className="text-white font-bold text-base mb-2" numberOfLines={2}>
          {movie.title}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={12} color="#9CA4AB" />
          <Text className="text-light-300 text-xs ml-1">
            {movie.releaseDate?.split("-")[0]}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#AB8BFF" />
          <Text className="text-accent text-xs ml-1 pt-1">
            {movie.voteAverage?.toFixed(1)}/10
          </Text>
        </View>

        <Text className="text-light-300 text-xs" numberOfLines={2}>
          {movie.overview}
        </Text>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => onRemove(movie.movieId)}
        className="p-3 justify-center"
      >
        <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default SavedMovieCard;
