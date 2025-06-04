import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter(); // Allows to move different screens

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0F0D23", "#1A0E2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
        >
          {moviesLoading || trendingLoading ? (
            <View className="flex-1 items-center justify-center mt-32">
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="mb-3"
              />
              <Text className="text-light-300 text-base font-medium">
                Loading movies...
              </Text>
            </View>
          ) : moviesError || trendingError ? (
            <View className="flex-1 items-center justify-center mt-32 px-8">
              <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 w-full">
                <Text className="text-red-400 text-center text-lg font-semibold mb-2">
                  Oops! Something went wrong
                </Text>
                <Text className="text-red-300 text-center text-sm">
                  {moviesError?.message || trendingError?.message}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1 pt-16">
              {/* Header Section */}
              <View className="mb-8">
                <Text className="text-3xl text-white font-bold mb-2">
                  FILMEX
                </Text>
                <Text className="text-light-300 text-base font-medium">
                  Find your next favorite movie
                </Text>
              </View>

              {/* Search Bar */}
              <View className="mb-8">
                <SearchBar
                  onPress={() => router.push("/search")}
                  placeholder="Search for movies, genres, actors..."
                />
              </View>

              {/* Trending Section */}
              {trendingMovies && trendingMovies.length > 0 && (
                <View className="mb-8">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-xl text-white font-bold">
                      🔥 Trending Now
                    </Text>
                    <View className="bg-accent/20 px-3 py-1 rounded-full">
                      <Text className="text-accent text-xs font-semibold">
                        HOT
                      </Text>
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

              {/* Latest Movies Section */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-5">
                  <Text className="text-xl text-white font-bold">
                    Latest Releases
                  </Text>
                  <View className="bg-green-500/20 px-3 py-1 rounded-full">
                    <Text className="text-green-400 text-xs font-semibold">
                      NEW
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 14,
                    marginBottom: 16,
                  }}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  scrollEnabled={false} // Let ScrollView handle scrolling
                />
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
