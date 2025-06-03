import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-6"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          marginBottom: 20,
          gap: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="pt-16 pb-8">
              <Text className="text-2xl text-white font-bold mb-2">
                Search Movies
              </Text>
              <Text className="text-light-300 text-base mb-6">
                Find your next favorite movie
              </Text>
              
              <SearchBar
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                placeholder="Search movies, actors, genres..."
              />
            </View>

            {/* Loading */}
            {loading && (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#AB8BFF" />
                <Text className="text-light-300 text-sm mt-3">
                  Searching...
                </Text>
              </View>
            )}

            {/* Error */}
            {error && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mx-1 my-4">
                <Text className="text-red-400 font-semibold mb-1">
                  Search Error
                </Text>
                <Text className="text-red-300 text-sm">
                  {error.message}
                </Text>
              </View>
            )}

            {/* Results Header */}
            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold">
                  Results for "{searchQuery}"
                </Text>
                <Text className="text-light-300 text-sm">
                  {movies.length} movies found
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="items-center py-12">
              {searchQuery.trim() ? (
                <View className="items-center">
                  <Text className="text-white text-lg font-semibold mb-2">
                    No movies found
                  </Text>
                  <Text className="text-light-300 text-sm text-center">
                    Try different keywords or check spelling
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-white text-lg font-semibold mb-2">
                    Search for movies
                  </Text>
                  <Text className="text-light-300 text-sm text-center">
                    Enter a movie title, actor, or genre above
                  </Text>
                </View>
              )}
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});