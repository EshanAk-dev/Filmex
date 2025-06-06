import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { fetchGenres, fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  // Trending movies
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // Genres
  const {
    data: genres,
    loading: genresLoading,
    error: genresError,
  } = useFetch(fetchGenres);

  // Pagination state for movies
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies when page changes
  useEffect(() => {
    const fetchData = async () => {
      setMoviesLoading(true);
      setMoviesError(null);
      try {
        const newMovies = await fetchMovies({ query: "", page });
        setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));
        if (page >= 10 || newMovies.length === 0) setHasMore(false);
      } catch (err) {
        setMoviesError(err);
      } finally {
        setMoviesLoading(false);
      }
    };
    fetchData();
  }, [page]);

  // Handler for loading more movies
  const handleLoadMore = () => {
    if (!moviesLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Handle genre selection
  const handleGenrePress = (genre: Genre) => {
    router.push(
      `/genre/${genre.id}?genreName=${encodeURIComponent(genre.name)}`
    );
  };

  // Header and trending section as a component
  const renderListHeader = () => (
    <View>
      {/* Header Section */}
      <View className="mb-8 pt-16">
        <Text className="text-4xl text-white font-bold mb-2">FILMEX</Text>
        <Text className="text-light-300 text-base font-medium">
          Discover, watch, and love the best movies.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="mb-8">
        <SearchBar
          onPress={() => router.push("/search")}
          placeholder="Search for movies, genres, actors..."
        />
      </View>

      {/* Genres Section */}
      {genres && genres.length > 0 && (
        <View className="mb-8">
          <Text className="text-lg text-white font-bold mb-4">
            Browse by Genre
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingEnd: 25 }}
          >
            {genres.slice(0, 15).map((genre) => (
              <TouchableOpacity
                key={genre.id}
                onPress={() => handleGenrePress(genre)}
                className="bg-accent/20 px-4 py-2 rounded-full mr-2.5"
                style={{ borderWidth: 1, borderColor: "#AB8BFF40" }}
              >
                <Text className="text-accent text-sm font-semibold">
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Trending Section */}
      {trendingMovies && trendingMovies.length > 0 && (
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl text-white font-bold">
              🔥 Trending Now
            </Text>
            <View className="bg-accent/20 px-3 py-1 rounded-full">
              <Text className="text-accent text-xs font-semibold">HOT</Text>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4" />}
            contentContainerStyle={{ paddingEnd: 25 }}
            data={trendingMovies}
            renderItem={({ item, index }) => (
              <TrendingCard movie={item} index={index} />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
          />
        </View>
      )}

      {/* Latest Movies Section Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-xl text-white font-bold">Latest Releases</Text>
        <View className="bg-green-500/20 px-3 py-1 rounded-full">
          <Text className="text-green-400 text-xs font-semibold">NEW</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        {(moviesLoading && movies.length === 0) ||
        trendingLoading ||
        genresLoading ? (
          <View className="flex-1 items-center justify-center mt-32">
            <ActivityIndicator size="large" color="#AB8BFF" className="mb-3" />
            <Text className="text-light-300 text-base font-medium">
              Loading movies...
            </Text>
          </View>
        ) : moviesError || trendingError || genresError ? (
          <View className="flex-1 items-center justify-center mt-32 px-8">
            <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 w-full">
              <Text className="text-red-400 text-center text-lg font-semibold mb-2">
                Oops! Something went wrong
              </Text>
              <Text className="text-red-300 text-center text-sm">
                {moviesError?.message ||
                  trendingError?.message ||
                  genresError?.message}
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
            contentContainerStyle={{
              paddingBottom: 120,
              paddingHorizontal: 24,
            }}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={
              hasMore && (
                <View className="items-center my-4">
                  {moviesLoading ? (
                    <ActivityIndicator size="small" color="#AB8BFF" />
                  ) : (
                    <TouchableOpacity
                      onPress={handleLoadMore}
                      style={{ marginTop: 8 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="reload-outline"
                          size={14}
                          color="#AB8BFF"
                          style={{ marginRight: 5 }}
                        />
                        <Text className="text-accent text-sm font-semibold">
                          Load More
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )
            }
          />
        )}
      </LinearGradient>
    </View>
  );
}
