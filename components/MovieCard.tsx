import placeholderImage from "@/assets/images/placeholder.png";
import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  original_language,
}: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <View className="relative">
          <Image
            source={
              poster_path
                ? { uri: `https://image.tmdb.org/t/p/w500${poster_path}` }
                : placeholderImage
            }
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />
          
          {/* Vote Average Badge */}
          <View className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex-row items-center">
            <Image source={icons.star} className="size-3 mr-1" tintColor="#FFD700" />
            <Text className="text-xs text-white font-bold">
              {vote_average.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Display movie title with a maximum of one line */}
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>
        
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-light-300 font-medium">
            {release_date?.split("-")[0] || "N/A"}{" "}
            {/* Display year from release_date */}
          </Text>
          <Text className="text-xs text-light-300 font-medium uppercase">
            {original_language || "N/A"} {/* Display original language */}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;

const styles = StyleSheet.create({});