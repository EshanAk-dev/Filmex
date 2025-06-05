import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const SAVED_MOVIES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export interface SavedMovie {
  $id?: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  savedAt: string;
}

// Save a movie for a user
export const saveMovie = async (
  userId: string,
  movie: Movie | MovieDetails
): Promise<void> => {
  try {
    // Check if movie is already saved
    const existing = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movieId", movie.id)]
    );

    if (existing.documents.length > 0) {
      throw new Error("Movie is already saved");
    }

    // Save the movie
    await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path || "",
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        overview: movie.overview || "",
        savedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.log("Error saving movie:", error);
    throw error;
  }
};

// Remove a saved movie
export const removeSavedMovie = async (
  userId: string,
  movieId: number
): Promise<void> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movieId", movieId)]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.log("Error removing saved movie:", error);
    throw error;
  }
};

// Get all saved movies for a user
export const getSavedMovies = async (userId: string): Promise<SavedMovie[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("savedAt")]
    );

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.log("Error fetching saved movies:", error);
    throw error;
  }
};

// Check if a movie is saved
export const isMovieSaved = async (
  userId: string,
  movieId: number
): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movieId", movieId)]
    );

    return result.documents.length > 0;
  } catch (error) {
    console.log("Error checking if movie is saved:", error);
    return false;
  }
};
