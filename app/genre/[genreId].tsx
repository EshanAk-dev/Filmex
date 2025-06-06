import MovieCard from "@/components/MovieCard";
import { fetchMoviesByGenre } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GenreMovies() {
  const router = useRouter();
  const { genreId, genreName } = useLocalSearchParams<{
    genreId: string;
    genreName: string;
  }>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (genreId) {
      fetchMoviesData(1, true);
    }
  }, [genreId]);

  const fetchMoviesData = async (pageNum: number, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const newMovies = await fetchMoviesByGenre({
        genreId: parseInt(genreId!),
        page: pageNum,
      });

      if (reset) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }

      if (pageNum >= 10 || newMovies.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMoviesData(nextPage);
    }
  };

  const renderHeader = () => (
    <View className="mb-6">
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mb-4"
      >
        <Ionicons name="arrow-back" size={22} color="#AB8BFF" />
        <Text className="text-accent text-xl font-semibold ml-2">Back</Text>
      </TouchableOpacity>

      <Text className="text-3xl text-white font-bold mb-2">{genreName}</Text>
      <Text className="text-light-300 text-base">
        Latest movies in {genreName?.toLowerCase()} genre
      </Text>
    </View>
  );

  if (loading && movies.length === 0) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={["#0F0D23", "#1A0E2E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#AB8BFF" className="mb-3" />
            <Text className="text-light-300 text-base font-medium">
              Loading {genreName?.toLowerCase()} movies...
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={["#0F0D23", "#1A0E2E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center px-8">
            <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 w-full">
              <Text className="text-red-400 text-center text-lg font-semibold mb-2">
                Oops! Something went wrong
              </Text>
              <Text className="text-red-300 text-center text-sm">
                {error?.message}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
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
            paddingTop: 60,
          }}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={
            hasMore && (
              <View className="items-center my-4">
                {loading ? (
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
      </LinearGradient>
    </View>
  );
}