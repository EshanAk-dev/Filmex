import placeholderImage from "@/assets/images/placeholder.png";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TrendingCard = ({
  movie: {
    movie_id,
    title,
    poster_url,
    original_language,
    vote_average,
    release_date,
  },
  index,
}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <View className="relative">
          <Image
            source={poster_url ? { uri: poster_url } : placeholderImage}
            className="w-32 h-48 rounded-lg"
            resizeMode="cover"
          />

          {/* Vote Average Badge */}
          <View className="absolute top-2 -right-3 bg-black/70 rounded-full px-2 py-0.5 flex-row items-center">
            <Ionicons
              name="star"
              size={10}
              color="#FFD700"
              style={{ marginRight: 4 }}
            />
            <Text className="text-xs text-white font-bold mt-0.5">
              {vote_average.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Display movie title */}
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center w-32 justify-between mt-1">
          <Text className="text-xs text-light-300 font-medium">
            {release_date?.split("-")[0] || "N/A"}
          </Text>
          <Text className="text-xs text-light-300 font-medium uppercase">
            {original_language || "N/A"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;

const styles = StyleSheet.create({});
